import express from 'express';
import {
    requireUser,
    requireInstructor,
    requireStudent
} from '../controllers/authController.js';
import {
   
    getResponsesByQuery
} from '../controllers/responseController.js';

const router = express.Router();

// Instructor/Admin verify responses
// router.patch('/verify/:id', requireUser, requireInstructor, verifyResponse);

// Get responses for a query (students can see their own query responses)
router.get('/query/:queryId', requireUser, getResponsesByQuery);

export default router;
