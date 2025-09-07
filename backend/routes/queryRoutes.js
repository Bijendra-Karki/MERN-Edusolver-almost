import express from 'express';
import {
    requireUser,
    requireInstructor,
    requireStudent
} from '../controllers/authController.js';
import {
    getQueries,
    getQueryById
} from '../controllers/queryController.js';

const router = express.Router();

// Students submit queries
// router.post('/submit', requireUser, requireStudent, submitQuery);

// Instructor/Admin respond to queries
// router.post('/respond', requireUser, requireInstructor, respondToQuery);

// Get all queries (accessible to admin & instructors)
router.get('/', requireUser, requireInstructor, getQueries);

// Get query by ID (student can view their own)
router.get('/:id', requireUser, getQueryById);

export default router;
