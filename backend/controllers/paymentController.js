import Payment from "../models/paymentModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Subject from "../models/subjectModel.js";
import crypto from "crypto";
import { Types } from "mongoose";
import axios from "axios";

// --- 1. Configuration Constants (Centralized) ---

const ESEWA_CONFIG = {
  // Frontend Redirect URLs
  SUCCESS_URL:
    process.env.FRONTEND_SUCCESS_URL || "http://localhost:5173/payment-success",
  FAILURE_URL:
    process.env.FRONTEND_FAILURE_URL || "http://localhost:5173/payment-failure",

  // eSewa Credentials
  SECRET_KEY: process.env.ESEWA_SECRET_KEY,
  PRODUCT_CODE: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",

  // eSewa API URLs (Using V2 URLs for the POST verification)
  VERIFICATION_URL:
    process.env.NODE_ENV === "production"
      ? "https://epay.esewa.com.np/api/epay/main/v2/transaction/status"
      : "https://uat.esewa.com.np/api/epay/main/v2/transaction/status",
};

// -----------------------------------------------------------
// 2. INTERNAL ESEWA SIGNATURE UTILITY (Private Function)
// -----------------------------------------------------------

/**
 * Generates the HMAC SHA256 signature required by eSewa.
 * @param {object} payload - Must contain total_amount, transaction_uuid, product_code.
 * @returns {string} The Base64 encoded signature.
 */
const _generateEsewaSignature = (payload) => {
  const { total_amount, transaction_uuid, product_code } = payload;

  const secretKey = ESEWA_CONFIG.SECRET_KEY;
  if (!secretKey) {
    throw new Error("ESEWA_SECRET_KEY is not configured.");
  }

  // 1. Construct the data string in the EXACT ORDER eSewa requires
  const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  // 2. Create the HMAC SHA256 signature
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("base64");

  return signature;
};

// -----------------------------------------------------------
// 3. INITIATE PAYMENT & GENERATE SIGNATURE
// -----------------------------------------------------------

// POST: /api/payments/initiate (Auth needed: requireSignin)
export const initiatePayment = async (req, res) => {
  const userId = req.auth._id;
  let { subjectId, amount } = req.body;

  // Input Validation and Cleaning
  amount = parseFloat(amount);
  if (
    !subjectId ||
    isNaN(amount) ||
    amount <= 0 ||
    !Types.ObjectId.isValid(subjectId)
  ) {
    return res
      .status(400)
      .json({ message: "Invalid subject ID or amount format." });
  }

  try {
    // Step 1: Verify Subject and actual price (Security Check)
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found." });
    }

    // Compare prices as two decimal place strings to avoid floating-point errors
    const receivedAmount = amount.toFixed(2);
    const subjectPrice = parseFloat(subject.price).toFixed(2);

    if (receivedAmount !== subjectPrice) {
      console.error(
        `Price mismatch: Received ${receivedAmount}, Expected ${subjectPrice} for Subject ID: ${subjectId}`
      );
      return res
        .status(400)
        .json({ message: "Subject price mismatch detected." });
    }

    // Step 2: Create a unique ID for this transaction
    const newPaymentId = new Types.ObjectId();
    const transaction_uuid = newPaymentId.toHexString(); // Use the _id as the uuid

    // Step 3: Create the Pending Payment Record in your DB
    const newPayment = new Payment({
      _id: newPaymentId,
      user_id: userId,
      subject_id: subjectId,
      amount: amount,
      method: "eSewa",
      status: "pending",
      verification_status: "unverified",
    });
    await newPayment.save();

    // Step 4: Prepare eSewa Form Data Payload
    const formDataPayload = {
      amount: amount,
      tax_amount: 0,
      total_amount: amount, // The amount used for signing
      transaction_uuid: transaction_uuid, // The UUID used for signing
      product_code: ESEWA_CONFIG.PRODUCT_CODE, // The code used for signing
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: ESEWA_CONFIG.SUCCESS_URL,
      failure_url: ESEWA_CONFIG.FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    // Step 5: Generate eSewa Signature
    const signature = _generateEsewaSignature(formDataPayload); // 👈 Use the internal utility

    // Step 6: Send back data to the client
    res.status(200).json({
      message: "Payment initiated successfully.",
      formData: formDataPayload,
      signature: signature, // Send signature back to the frontend for the hidden form submission
    });
  } catch (error) {
    console.error("Error during payment initiation:", error);
    res
      .status(500)
      .json({ message: "Failed to initiate payment.", error: error.message });
  }
};

// -----------------------------------------------------------
// 4. ESEWA PAYMENT VERIFICATION UTILITY (FIXED)
// -----------------------------------------------------------

/**
 * Decodes eSewa data and performs the server-to-server verification call.
 * @param {string} eSewaResponseData - Base64 encoded data from eSewa redirect.
 * @returns {object} { isVerified, refId, orderId }
 */
const verifyEsewaPayment = async (eSewaResponseData) => {
  let refId = null;
  let orderId = null;
  try {
    // 1. Decode eSewaResponseData (Base64)
    const decodedData = Buffer.from(eSewaResponseData, "base64").toString(
      "utf8"
    );
    const responseJson = JSON.parse(decodedData);
    refId = responseJson.transaction_code; // eSewa's transaction ID
    orderId = responseJson.transaction_uuid; // Our unique payment ID

    if (!refId || !orderId) {
      console.error("eSewa response missing transaction codes.");
      return { isVerified: false, refId, orderId };
    }

    // 2. Retrieve Original Amount for Security
    const paymentRecord = await Payment.findById(orderId);
    if (!paymentRecord) {
      console.error(`Payment record not found for orderId: ${orderId}`);
      return { isVerified: false, refId, orderId };
    }
    const originalAmount = paymentRecord.amount; // Use the stored amount

    // 3. Prepare the Payload for eSewa's Server-to-Server Verification API
    const verificationPayload = {
      total_amount: originalAmount, // CRITICAL: Used for signing
      transaction_uuid: orderId,
      product_code: ESEWA_CONFIG.PRODUCT_CODE,
    };

    // 4. Generate Verification Signature
    // Use the internal utility and the data required for signing
    const verificationSignature = _generateEsewaSignature(verificationPayload);

    // 5. Execute the Verification API Call
    const apiResponse = await axios.post(
      ESEWA_CONFIG.VERIFICATION_URL,
      {
        // Body params for the V2 API (as per documentation)
        amount: originalAmount,
        product_code: ESEWA_CONFIG.PRODUCT_CODE,
        transaction_uuid: orderId,
        // The V2 API requires the success_url for some transactions, although not always in the body
      },
      {
        headers: {
          "Content-Type": "application/json",
          // Send the signature as a header (check eSewa V2 docs, sometimes it's `tx-signature`)
          signature: verificationSignature, 
        },
      }
    );

    const status = apiResponse.data.status;
    const isSuccess = status === "COMPLETE" || status === "VERIFIED";

    if (isSuccess) {
      console.log(`eSewa verification successful for order: ${orderId}`);
    } else {
      console.warn(`eSewa verification failed. Status: ${status}`);
    }

    return {
      isVerified: isSuccess,
      refId,
      orderId,
    };
  } catch (error) {
    console.error(
      `Error during eSewa API verification for order ${orderId}:`,
      error.response?.data || error.message
    );
    return { isVerified: false, refId, orderId };
  }
};

// -----------------------------------------------------------
// 5. ESEWA PAYMENT VERIFICATION ENDPOINT
// -----------------------------------------------------------
// ... (verifyPaymentAndEnroll remains the same, as it calls the fixed utility)

export const verifyPaymentAndEnroll = async (req, res) => {
    // ... (Your original implementation using the verifyEsewaPayment utility)
    const { data: eSewaResponseData } = req.query;

    if (!eSewaResponseData) {
        return res.redirect(`${ESEWA_CONFIG.FAILURE_URL}?msg=TransactionCancelled`);
    }

    try {
        const { isVerified, refId, orderId } = await verifyEsewaPayment(
            eSewaResponseData
        );

        const payment = await Payment.findById(orderId);
        if (!payment) {
            return res.redirect(
                `${ESEWA_CONFIG.FAILURE_URL}?msg=PaymentNotFound&uuid=${orderId}`
            );
        }

        if (isVerified) {
            payment.status = "completed";
            payment.verification_status = "verified";
            payment.gateway_ref_id = refId;
            await payment.save();

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

            return res.redirect(
                `${ESEWA_CONFIG.SUCCESS_URL}?subjectId=${payment.subject_id}&paymentId=${payment._id}&refId=${refId}`
            );
        } else {
            payment.status = "failed";
            payment.verification_status = "invalid_data";
            if (refId) payment.gateway_ref_id = refId;
            await payment.save();

            return res.redirect(
                `${ESEWA_CONFIG.FAILURE_URL}?msg=PaymentVerificationFailed&uuid=${orderId}`
            );
        }
    } catch (error) {
        console.error(
            "Critical error during verification and enrollment process:",
            error
        );
        return res.redirect(`${ESEWA_CONFIG.FAILURE_URL}?msg=InternalServerError`);
    }
};

// -----------------------------------------------------------
// 6. ADMIN/USER CRUD OPERATIONS
// -----------------------------------------------------------

// GET all payments (Admin use only)
export const getPayments = async (req, res) => {
  try {
    // Populate subject_id too, for better context in the admin view
    const payments = await Payment.find()
      .populate("user_id", "name email")
      .populate("subject_id", "title price");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET payment by ID (User or Admin)
export const getPaymentById = async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    const { _id: userId, role: userRole } = req.auth;

    const payment = await Payment.findById(paymentId)
      .populate("user_id", "name email")
      .populate("subject_id", "title price");

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    // Authorization Check: Must be admin OR the user who made the payment
    const isOwner =
      payment.user_id && payment.user_id._id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isAdmin && !isOwner) {
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
      runValidators: true, // Good practice for updates
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
    // Also consider deleting the corresponding Enrollment record here, if appropriate
    await Enrollment.deleteOne({ payment_id: payment._id });
    res.json({ msg: "Payment and associated enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
