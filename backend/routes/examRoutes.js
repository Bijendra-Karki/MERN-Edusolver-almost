import express from 'express';
import {
    requireUser,
    requireInstructor,
    requireAdmin
} from '../controllers/authController.js';
import {
    createExam,
    getExams,
    getExamById
} from '../controllers/examController.js';

const router = express.Router();

// Instructor/Admin manage exams
router.post('/createExam', requireUser,requireAdmin, requireInstructor, createExam);

// All users can view exams
router.get('/examlist', requireUser, getExams);
router.get('/examDetails/:id', requireUser, getExamById);

export default router;
