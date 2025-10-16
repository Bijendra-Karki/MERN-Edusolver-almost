import Enrollment from "../models/enrollmentModel.js";
import User from "../models/userModel.js";
import Subject from "../models/subjectModel.js";
import Payment from "../models/paymentModel.js";
import crypto from "crypto";


// NOTE: The payment flow functions (initiatePayment, verifyPaymentAndEnroll)
// have been moved to controllers/paymentController.js for better organization.

// -----------------------------------------------------------
// ENROLLMENT CRUD CONTROLLERS
// -----------------------------------------------------------

// GET all enrollments (Admin only)
export const getEnrollments = async (req, res) => {
  // ⚠️ Access controlled by requireAdmin middleware
  try {
    const enrollments = await Enrollment.find()
      .populate("user_id", "name email")
      .populate("subject_id", "title");
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET enrollment by ID (User/Admin access control implemented below)
export const getEnrollmentById = async (req, res) => {
  try {
    const enrollmentId = req.params.id;
    const userId = req.auth._id; // ID of the currently logged-in user
    const userRole = req.auth.role;

    const enrollment = await Enrollment.findById(enrollmentId)
      .populate("user_id", "name email")
      .populate("subject_id", "title");

    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });

    // Authorization Check: Must be the user who owns the enrollment or an Admin.
    if (
      userRole !== "admin" &&
      enrollment.user_id._id.toString() !== userId.toString()
    ) {
      return res
        .status(403)
        .json({
          error: "Access denied. You can only view your own enrollments.",
        });
    }

    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET enrollments for the currently logged-in user (User only)
export const getUserEnrollments = async (req, res) => {
  // ✅ Securely fetch the user ID from the token
  const user_id = req.auth._id;

  try {
    const enrollments = await Enrollment.find({ user_id: user_id }).populate(
      "subject_id",
      "title description price"
    );

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE enrollment (Admin only, e.g., changing access_status)
export const updateEnrollment = async (req, res) => {
  // ⚠️ Access controlled by requireAdmin middleware
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE enrollment (Admin only)
export const deleteEnrollment = async (req, res) => {
  // ⚠️ Access controlled by requireAdmin middleware
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment)
      return res.status(404).json({ error: "Enrollment not found" });
    res.json({ msg: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NOTE: The generateSignature function is now typically located in the Payment Controller
// or a utility file, so it is removed here.
