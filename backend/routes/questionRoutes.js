import express from "express";
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import { requireInstructor, requireSignin, requireUser } from "../controllers/authController.js";

const router = express.Router();

// Create a new question
router.post("/createQuestion",requireSignin,requireInstructor, createQuestion);

// Get all questions or filter by examSet (?examSet=<id>)
router.get("/questionList", requireSignin,requireUser,getQuestions);

// Get single question
router.get("/questionDetails/:id", getQuestionById);

// Update question
router.put("/questionUpdate/:id", updateQuestion);

// Delete question
router.delete("/questionDelete/:id", deleteQuestion);

export default router;
