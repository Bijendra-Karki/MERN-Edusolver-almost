import crypto from "crypto";
import axios from "axios";
import Payment from "../models/paymentModel.js";
import Subject from "../models/subjectModel.js";   // Make sure this is correct
import Enrollment from "../models/enrollmentModel.js"; // if you plan to delete enrollments
import mongoose from "mongoose";


// -----------------------------------------------------------
// VERIFY PAYMENT WITH ESEWA RESPONSE
// -----------------------------------------------------------
export const verifyEsewaPayment = async (req, res) => {
  try {
    const { transaction_uuid, ref_id, total_amount, user_id } = req.body;

    // Step 1: Validate required fields
    if (!transaction_uuid || !ref_id || !total_amount || !user_id) {
      return res
        .status(400)
        .json({ error: "Missing required verification data" });
    }

    // Step 2: Verify with eSewa API (sandbox or live)
    const verifyPayload = {
      product_code: "EPAYTEST", // use your live code later
      total_amount,
      transaction_uuid,
    };

    const esewaResponse = await axios.post(
      "https://rc.esewa.com.np/api/epay/transaction/status/",
      verifyPayload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { status } = esewaResponse.data;

    // Step 3: If successful, mark payment as completed
    if (status === "COMPLETE") {
      const updatedPayment = await Payment.findOneAndUpdate(
        { user_id, gateway_ref_id: transaction_uuid },
        {
          status: "completed",
          verification_status: "verified",
          gateway_ref_id: ref_id, // replace with eSewa reference ID
        },
        { new: true }
      );

      if (!updatedPayment) {
        return res.status(404).json({ error: "Payment record not found" });
      }

      return res.status(200).json({
        message: "Payment verified successfully",
        status: "completed",
        payment: updatedPayment,
      });
    }

    // Step 4: Handle failed verification
    res.status(400).json({
      message: "Payment verification failed",
      status: "failed",
      gatewayResponse: esewaResponse.data,
    });
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ error: "Server error verifying payment" });
  }
};

export const generateSignature = (req, res) => {
  const { total_amount, transaction_uuid, product_code } = req.body;
  const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  // user secret key to create Hmac sha256 signature
  const secretKey = process.env.ESEWA_SECRET_KEY;

  // Check if secretKey is available (good practice)
  if (!secretKey) {
    return res.status(500).json({ error: "ESEWA_SECRET_KEY not configured" });
  }

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(dataToSign)
    .digest("base64");

  res.json({ signature });
};




// -----------------------------------------------------------
// CREATE PAYMENT (Before Redirect to eSewa)
// -----------------------------------------------------------
export const createPayment = async (req, res) => {
  try {
    console.log("Request body:", req.body);   // DEBUG
    console.log("Authenticated user:", req.auth); // DEBUG

    // Destructure from body
    const { subject_id, amount, method } = req.body;

    // Check if user is authenticated
    if (!req.auth || !req.auth._id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const user_id = req.auth._id;

    // Validate input
    if (!subject_id || !amount) {
      return res
        .status(400)
        .json({ error: "Subject ID and amount are required" });
    }

    // Validate subject_id format
    if (!mongoose.Types.ObjectId.isValid(subject_id)) {
      return res.status(400).json({ error: "Invalid Subject ID" });
    }

    // Check if subject exists
    const subject = await Subject.findById(subject_id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    // Check if user already paid for this subject
    const existingPayment = await Payment.findOne({
      user_id,
      subject_id,
      status: "completed",
    });
    if (existingPayment) {
      return res
        .status(400)
        .json({ error: "You have already paid for this subject." });
    }

    // Create new payment (pending)
    const payment = new Payment({
      user_id,
      subject_id,
      amount,
      method: method || "eSewa",
      status: "pending",
      verification_status: "unverified",
    });

    await payment.save();

    console.log("Payment created:", payment); // DEBUG

    // Return minimal info to frontend
    res.status(201).json({
      message: "Payment record created",
      payment_id: payment._id,
      amount: payment.amount,
      subject_id: payment.subject_id,
      status: payment.status,
    });
  } catch (err) {
    console.error("Error creating payment:", err);
    res.status(500).json({ error: "Server error creating payment" });
  }
};


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
