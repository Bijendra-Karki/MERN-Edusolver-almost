import express from 'express';
import {
    requireUser,
    requireInstructor
} from '../controllers/authController.js';
import {
    createExam,
    getExams,
    getExamById
} from '../controllers/examController.js';

const router = express.Router();

// Instructor/Admin manage exams
router.post('/create', requireUser, requireInstructor, createExam);

// All users can view exams
router.get('/', requireUser, getExams);
router.get('/:id', requireUser, getExamById);

export default router;
