import Payment from "../models/paymentModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Subject from "../models/subjectModel.js";
import crypto from "crypto";
import { Types } from "mongoose";
import axios from "axios";

// --- 1. Configuration Constants ---
const ESEWA_CONFIG = {
  SUCCESS_URL:
    process.env.FRONTEND_SUCCESS_URL || "http://localhost:5173/payment-success",
  FAILURE_URL:
    process.env.FRONTEND_FAILURE_URL || "http://localhost:5173/payment-failure",
  SECRET_KEY: process.env.ESEWA_SECRET_KEY,
  PRODUCT_CODE: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
  VERIFICATION_URL:
    process.env.NODE_ENV === "production"
      ? "https://epay.esewa.com.np/api/epay/main/v2/transaction/status"
      : "https://uat.esewa.com.np/api/epay/main/v2/transaction/status",
};

// --- 2. Utility: Generate eSewa Signature ---
const _generateEsewaSignature = (payload) => {
  const { total_amount, transaction_uuid, product_code } = payload;

  if (!ESEWA_CONFIG.SECRET_KEY) {
    throw new Error("ESEWA_SECRET_KEY is not configured in environment.");
  }
  if (!total_amount || !transaction_uuid || !product_code) {
    throw new Error("Missing required data for eSewa signature.");
  }

  const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  const signature = crypto
    .createHmac("sha256", ESEWA_CONFIG.SECRET_KEY)
    .update(dataToSign)
    .digest("base64");

  return signature;
};

// --- 3. Initiate Payment ---
export const initiatePayment = async (req, res) => {
  const userId = req.auth._id;
  let { subjectId, amount } = req.body;

  // Validate input
  if (!subjectId || !amount) {
    return res.status(400).json({ message: "Missing subjectId or amount." });
  }

  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount." });
  }

  if (!Types.ObjectId.isValid(subjectId)) {
    return res.status(400).json({ message: "Invalid subject ID." });
  }

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found." });

    const receivedAmount = amount.toFixed(2);
    const subjectPrice = parseFloat(subject.price).toFixed(2);

    if (receivedAmount !== subjectPrice) {
      console.error(
        `Price mismatch: Received ${receivedAmount}, Expected ${subjectPrice}`
      );
      return res.status(400).json({ message: "Subject price mismatch." });
    }

    const newPaymentId = new Types.ObjectId();
    const transaction_uuid = newPaymentId.toHexString();

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

    const formDataPayload = {
      amount: amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transaction_uuid,
      product_code: ESEWA_CONFIG.PRODUCT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: ESEWA_CONFIG.SUCCESS_URL,
      failure_url: ESEWA_CONFIG.FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signature = _generateEsewaSignature(formDataPayload);

    return res.status(200).json({
      message: "Payment initiated successfully.",
      formData: formDataPayload,
      signature,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    return res
      .status(500)
      .json({ message: "Failed to initiate payment.", error: error.message });
  }
};

// --- 4. Verify Payment Utility ---
const verifyEsewaPayment = async (eSewaResponseData) => {
  let refId = null;
  let orderId = null;

  try {
    if (!eSewaResponseData) {
      throw new Error("No eSewa response data received.");
    }

    const decodedData = Buffer.from(eSewaResponseData, "base64").toString("utf8");
    const responseJson = JSON.parse(decodedData);

    refId = responseJson.transaction_code;
    orderId = responseJson.transaction_uuid;

    if (!refId || !orderId) {
      console.error("eSewa response missing transaction codes.");
      return { isVerified: false, refId, orderId };
    }

    const paymentRecord = await Payment.findById(orderId);
    if (!paymentRecord) {
      console.error(`Payment record not found for orderId: ${orderId}`);
      return { isVerified: false, refId, orderId };
    }

    const originalAmount = paymentRecord.amount;

    const verificationPayload = {
      total_amount: originalAmount,
      transaction_uuid: orderId,
      product_code: ESEWA_CONFIG.PRODUCT_CODE,
    };

    const verificationSignature = _generateEsewaSignature(verificationPayload);

    const apiResponse = await axios.post(
      ESEWA_CONFIG.VERIFICATION_URL,
      {
        amount: originalAmount,
        product_code: ESEWA_CONFIG.PRODUCT_CODE,
        transaction_uuid: orderId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          signature: verificationSignature,
        },
      }
    );

    const status = apiResponse.data.status;
    const isSuccess = status === "COMPLETE" || status === "VERIFIED";

    return { isVerified: isSuccess, refId, orderId };
  } catch (error) {
    console.error("Error verifying eSewa payment:", error.response?.data || error.message);
    return { isVerified: false, refId, orderId };
  }
};

// --- 5. Verify Payment & Enroll ---
export const verifyPaymentAndEnroll = async (req, res) => {
  const { data: eSewaResponseData } = req.query;

  if (!eSewaResponseData) {
    return res.redirect(`${ESEWA_CONFIG.FAILURE_URL}?msg=TransactionCancelled`);
  }

  try {
    const { isVerified, refId, orderId } = await verifyEsewaPayment(eSewaResponseData);

    const payment = await Payment.findById(orderId);
    if (!payment) {
      return res.redirect(`${ESEWA_CONFIG.FAILURE_URL}?msg=PaymentNotFound`);
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
    console.error("Critical error during verification:", error);
    return res.redirect(`${ESEWA_CONFIG.FAILURE_URL}?msg=InternalServerError`);
  }
};

// --- 6. Admin/User Payment CRUD ---
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user_id", "name email")
      .populate("subject_id", "title price");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id: paymentId } = req.params;
    const { _id: userId, role: userRole } = req.auth;

    const payment = await Payment.findById(paymentId)
      .populate("user_id", "name email")
      .populate("subject_id", "title price");

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    const isOwner = payment.user_id && payment.user_id._id.toString() === userId.toString();
    const isAdmin = userRole === "admin";

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Access denied." });
    }

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    await Enrollment.deleteOne({ payment_id: payment._id });
    res.json({ msg: "Payment and associated enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
