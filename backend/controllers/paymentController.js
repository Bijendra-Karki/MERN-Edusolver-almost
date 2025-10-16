// paymentController.js
import Payment from "../models/paymentModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Subject from "../models/subjectModel.js";
import crypto from "crypto";
import { Types } from "mongoose"; // Import Types for ObjectId check

// --- Configuration Constants ---
// NOTE: Ensure these environment variables are correctly set in your .env file
const FRONTEND_SUCCESS_URL =
  process.env.FRONTEND_SUCCESS_URL || "http://localhost:3000/payment-success"; // Fixed to match frontend failure_url
const FRONTEND_FAILURE_URL =
  process.env.FRONTEND_FAILURE_URL || "http://localhost:3000/payment-failure"; // Fixed to match frontend success_url
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY;
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST"; // Use ENV var for product code

// ---------------------------
// 1. ESEWA SIGNATURE GENERATION (Internal Utility)
// -----------------------------------------------------------
const generateEsewaSignature = ({
  total_amount,
  transaction_uuid,
  product_code,
}) => {
  const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  if (!ESEWA_SECRET_KEY) {
    throw new Error("ESEWA_SECRET_KEY is not configured.");
  }

  const signature = crypto
    .createHmac("sha256", ESEWA_SECRET_KEY)
    .update(dataToSign)
    .digest("base64");

  return signature;
};

// -----------------------------------------------------------
// 2. INITIATE PAYMENT & GENERATE SIGNATURE (NEW FLOW)
// -----------------------------------------------------------
// POST: /api/payments/initiate (Auth needed: requireSignin)
export const initiatePayment = async (req, res) => {
  const userId = req.auth._id;
  const { subjectId, amount } = req.body;

  // Basic Input Validation
  if (!subjectId || !amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid subject ID or amount." });
  }
  if (!Types.ObjectId.isValid(subjectId)) {
    return res.status(400).json({ message: "Invalid Subject ID format." });
  }

  try {
    // Step 1: Verify Subject and actual price (Security Check)
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // 🎯 THE FIX: Convert both values to two decimal places (fixed-point string) for reliable comparison
    // This prevents floating-point issues (e.g., 1000.000000001 !== 1000)
    const receivedAmount = parseFloat(amount).toFixed(2);
    const subjectPrice = parseFloat(subject.price).toFixed(2); // Assuming subject.price is a Number/Decimal

    if (receivedAmount !== subjectPrice) {
      // 💡 Recommended: Log the actual values to your server console for debugging
      console.error(
        `Price mismatch: Received ${receivedAmount}, Expected ${subjectPrice} for Subject ID: ${subjectId}`
      );
      return res
        .status(400)
        .json({ message: "Subject or price mismatch detected." });
    }

    // Step 2: Generate a unique ID for this transaction (Your internal UUID)
    // Use the MongoDB _id to ensure uniqueness and a link to the payment record
    const newPaymentId = new Types.ObjectId();
    const transaction_uuid = newPaymentId.toHexString(); // Use the _id as the uuid

    // Step 3: Create the Pending Payment Record in your DB
    const newPayment = new Payment({
      _id: newPaymentId, // Use the generated ObjectId
      user_id: userId,
      subject_id: subjectId,
      amount: amount,
      method: "eSewa",
      gateway_ref_id: transaction_uuid, // CRUCIAL: Store our internal UUID (which is the MongoDB _id)
      status: "pending",
      verification_status: "unverified",
    });
    await newPayment.save();

    // Step 4: Prepare eSewa Form Data
    const formData = {
      amount: amount,
      tax_amount: 0,
      total_amount: amount, // Total amount is just the subject price
      transaction_uuid: transaction_uuid, // Use the DB's ID/UUID
      product_code: ESEWA_PRODUCT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      // NOTE: Must use an external, public-facing domain for production
      success_url: FRONTEND_SUCCESS_URL,
      failure_url: FRONTEND_FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    // Step 5: Generate eSewa Signature
    const signature = generateEsewaSignature(formData);

    // Step 6: Send back formData and signature to the client
    res.status(200).json({
      message: "Payment initiated successfully.",
      formData: formData,
      signature: signature,
    });
  } catch (error) {
    console.error("Error during payment initiation:", error);
    res
      .status(500)
      .json({ message: "Failed to initiate payment.", error: error.message });
  }
};

// -----------------------------------------------------------
// 4. ESEWA PAYMENT VERIFICATION (Unchanged logic, minor cleanup)
// -----------------------------------------------------------
// GET: /api/payments/verify (No auth needed, called by eSewa)
// NOTE: You still need a `verifyEsewaPayment` utility function to handle the
// server-to-server verification call to eSewa's system using the `data` query param.

export const verifyPaymentAndEnroll = async (req, res) => {
  const { data: eSewaResponseData } = req.query;

  if (!eSewaResponseData) {
    // eSewa sends no data if transaction is cancelled by user
    return res.redirect(`${FRONTEND_FAILURE_URL}?msg=TransactionCancelled`);
  }

  try {
    // This is a placeholder for your actual server-to-server verification function
    // It should:
    // 1. Decode eSewaResponseData (Base64)
    // 2. Check the signature sent by eSewa against your secret key (or call eSewa API).
    // 3. Parse the details like transaction code (refId) and our transaction UUID (orderId).

    // **YOU MUST IMPLEMENT `verifyEsewaPayment`**
    // It must return an object like: { isVerified: boolean, refId: string (e.g., TXN1234), orderId: string (our transaction_uuid/DB ID) }
    const verificationResult = await verifyEsewaPayment(eSewaResponseData);

    const { isVerified, refId, orderId } = verificationResult;

    // orderId is the `transaction_uuid` which we set to be the Payment._id.toHexString()
    const payment = await Payment.findById(orderId);
    if (!payment) {
      return res.redirect(
        `${FRONTEND_FAILURE_URL}?msg=PaymentNotFound&uuid=${orderId}`
      );
    }

    if (isVerified) {
      payment.status = "completed";
      payment.verification_status = "verified";
      payment.gateway_ref_id = refId; // Store eSewa's transaction ID
    } else {
      payment.status = "failed";
      payment.verification_status = "invalid_data";
    }
    await payment.save();

    if (isVerified) {
      // Check for existing enrollment to prevent duplicates
      let enrollment = await Enrollment.findOne({
        user_id: payment.user_id,
        subject_id: payment.subject_id,
      });

      if (!enrollment) {
        enrollment = new Enrollment({
          user_id: payment.user_id,
          subject_id: payment.subject_id,
          payment_id: payment._id,
          access_status: "active",
        });
        await enrollment.save();
      }

      // Redirect to success page with relevant IDs
      return res.redirect(
        `${FRONTEND_SUCCESS_URL}?subjectId=${payment.subject_id}&paymentId=${payment._id}&refId=${refId}`
      );
    } else {
      // Verification failed or payment was unsuccessful
      return res.redirect(
        `${FRONTEND_FAILURE_URL}?msg=PaymentVerificationFailed&uuid=${orderId}`
      );
    }
  } catch (error) {
    console.error("Error during verification and enrollment:", error);
    return res.redirect(`${FRONTEND_FAILURE_URL}?msg=InternalServerError`);
  }
};

// -----------------------------------------------------------
// 5. ADMIN CRUD OPERATIONS (Unchanged)
// -----------------------------------------------------------

// GET all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user_id", "name email");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const userId = req.auth._id;
    const userRole = req.auth.role;

    const payment = await Payment.findById(paymentId).populate(
      "user_id",
      "name email"
    );
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    if (
      userRole !== "admin" &&
      payment.user_id._id.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({ error: "Access denied. Not authorized to view this payment." });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE payment (Admin use only)
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE payment (Admin use only)
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json({ msg: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
