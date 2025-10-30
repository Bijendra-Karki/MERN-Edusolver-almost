import express from "express";
import {
  createExam,
  getExamById,
  updateExam,
  deleteExam,
  getExamList,
} from "../controllers/examController.js";
import { requireAdmin, requireSignin } from "../controllers/authController.js";

const router = express.Router();

// Create exam
router.post("/createExam", requireSignin, requireAdmin, createExam);

// Get all exams (or by subject via ?subject_id=)
router.get("/examList", getExamList);

// Get single exam
router.get("/examDetail/:id", getExamById);

// Update exam
router.put("/examUpdate/:id", updateExam);

// Delete exam
router.delete("/examDelete/:id", deleteExam);

export default router;
