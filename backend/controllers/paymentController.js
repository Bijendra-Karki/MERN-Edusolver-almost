import Payment from "../models/paymentModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Subject from "../models/subjectModel.js";
import crypto from "crypto";
import { Types } from "mongoose";
import axios from "axios";
import qs from "qs";

// --- Configuration ---
const ESEWA_CONFIG = {
  SUCCESS_URL: process.env.FRONTEND_SUCCESS_URL || "http://localhost:5173/payment-success",
  FAILURE_URL: process.env.FRONTEND_FAILURE_URL || "http://localhost:5173/payment-failure",
  SECRET_KEY: process.env.ESEWA_SECRET_KEY,
  PRODUCT_CODE: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
  VERIFICATION_URL:
    process.env.NODE_ENV === "production"
      ? "https://epay.esewa.com.np/api/epay/main/v2/transaction/status"
      : "https://uat.esewa.com.np/api/epay/main/v2/transaction/status",
};

// --- Utility: Generate eSewa Signature ---
const _generateEsewaSignature = (payload) => {
  const { total_amount, transaction_uuid, product_code } = payload;
  if (!ESEWA_CONFIG.SECRET_KEY) throw new Error("ESEWA_SECRET_KEY not configured.");
  if (!total_amount || !transaction_uuid || !product_code)
    throw new Error("Missing required data for eSewa signature.");

  const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  return crypto.createHmac("sha256", ESEWA_CONFIG.SECRET_KEY).update(dataToSign).digest("base64");
};

// --- 1. Initiate Payment ---
export const initiatePayment = async (req, res) => {
  const userId = req.auth._id;
  let { subjectId, amount } = req.body;

  if (!subjectId || !amount) return res.status(400).json({ message: "Missing subjectId or amount." });
  amount = parseFloat(amount);
  if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "Invalid amount." });
  if (!Types.ObjectId.isValid(subjectId)) return res.status(400).json({ message: "Invalid subject ID." });

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found." });

    if (amount.toFixed(2) !== parseFloat(subject.price).toFixed(2)) {
      return res.status(400).json({ message: "Subject price mismatch." });
    }

    const newPaymentId = new Types.ObjectId();
    const transaction_uuid = newPaymentId.toHexString();

    const newPayment = new Payment({
      _id: newPaymentId,
      user_id: userId,
      subject_id: subjectId,
      amount,
      method: "eSewa",
      transaction_uuid,
      status: "pending",
      verification_status: "unverified",
    });

    await newPayment.save();

    const formDataPayload = {
      amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid,
      product_code: ESEWA_CONFIG.PRODUCT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: ESEWA_CONFIG.SUCCESS_URL,
      failure_url: ESEWA_CONFIG.FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    const signature = _generateEsewaSignature(formDataPayload);

    res.status(200).json({
      message: "Payment initiated successfully.",
      formData: formDataPayload,
      signature,
    });
  } catch (err) {
    console.error("Payment initiation failed:", err.message);
    res.status(500).json({ message: "Payment initiation failed.", error: err.message });
  }
};

// --- 2. Verify Payment & Enroll ---
export const verifyPaymentAndEnroll = async (req, res) => {

  try {
    const { data } = req.body; // POST body
    if (!data) return res.status(400).json({ verified: false, message: "Missing payment data" });
  

    // Decode Base64 eSewa data
    let decodedData;
    try {
      decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf8"));
    } catch {
      return res.status(400).json({ verified: false, message: "Invalid payment data format" });
    }

    const { transaction_uuid, total_amount, transaction_code, status } = decodedData;

    if (!transaction_uuid || !transaction_code) {
      return res.status(400).json({ verified: false, message: "Missing transaction info" });
    }
    

    const payment = await Payment.findOne({ transaction_uuid });
    if (!payment) return res.status(404).json({ verified: false, message: "Payment record not found" });

    if(payment.amount !== parseFloat(total_amount)){
      return res.status(400).json({ verified: false, message: "Amount mismatch" });
    }

    if (status === "COMPLETE") {
      payment.status = "completed";
      payment.verification_status = "verified";
      payment.amount = total_amount;
      payment.refId = transaction_code;
      await payment.save();

      // Enroll user if not already
      const existingEnrollment = await Enrollment.findOne({
        user_id: payment.user_id,
        subject_id: payment.subject_id,
      });

      if (!existingEnrollment) {
        await Enrollment.create({
          user_id: payment.user_id,
          subject_id: payment.subject_id,
          payment_id: payment._id,
          access_status: "active",
        });
      }
      console.log("Total Amount:", total_amount);
      return res.status(200).json({
        verified: true,
        amount: total_amount,
        refId: transaction_code,
        orderId: transaction_uuid,
      });
    } else {
      // Optional: mark failed if status not complete
      payment.status = "failed";
      payment.verification_status = "invalid_data";
      await payment.save();

      return res.status(400).json({ verified: false, message: "Payment not complete" });
    }
  } catch (err) {
    console.error("Payment verification error:", err.message);
    return res.status(500).json({ verified: false, message: "Internal server error", error: err.message });
  }
};

// --- 3. Payment CRUD (Admin/User) ---
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
    const { id } = req.params;
    const { _id: userId, role } = req.auth;

    const payment = await Payment.findById(id)
      .populate("user_id", "name email")
      .populate("subject_id", "title price");

    if (!payment) return res.status(404).json({ error: "Payment not found" });

    const isOwner = payment.user_id._id.toString() === userId.toString();
    const isAdmin = role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Access denied." });

    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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
    res.json({ msg: "Payment and enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
