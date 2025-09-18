import express from "express";
import {
  getEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  generateSignature,
} from "../../controllers/enrollmentController.js";


import { requireSignin, requireStudent, requireAdmin } from "../../controllers/authController.js";


const router = express.Router();

// 🔹 Enrollment Routes
router.get("/", requireSignin, getEnrollments); // all enrollments
router.get("/:id", requireSignin, getEnrollmentById); // single enrollment
router.post("/", requireSignin, requireStudent, createEnrollment); // student enroll
router.put("/:id", requireSignin, updateEnrollment); // update enrollment
router.delete("/:id", requireSignin, requireAdmin, deleteEnrollment); // only admin can delete

// POST -> generate esewa signature
router.post('/esewa/signature', generateSignature);

export default router;
