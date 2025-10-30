import express from "express";
import {
  submitExamAttempt,
  getStudentAttempts,
  getUserAttempts,
  getAttemptById,
} from "../controllers/examAttemptController.js";
import { requireSignin, requireStudent, requireUser } from "../controllers/authController.js";

const router = express.Router();

// Submit exam answers (Students only)
router.post("/submit", requireSignin, requireStudent, submitExamAttempt);

// View all student attempts (Admin / Instructor)
router.get("/studentResults", requireSignin, requireUser, getStudentAttempts);

// ✅ View attempts for a specific student by ID
router.get("/result/:id", requireSignin, requireUser, getUserAttempts);

// Get single attempt details
router.get("/attempt/:id", requireSignin, requireUser, getAttemptById);

export default router;
