import express from 'express';
import {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} from '../controllers/questionController.js';

const router = express.Router();

// GET all questions
router.get('questionlist/', getQuestions);

// GET single question by ID
router.get('questiondetails/:id', getQuestionById);

// CREATE new question
router.post('/postquestion', createQuestion);

// UPDATE existing question
router.put('/updatequestion/:id', updateQuestion);

// DELETE question
router.delete('deletequestion/:id', deleteQuestion);

export default router;
