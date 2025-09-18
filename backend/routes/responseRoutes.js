import express from 'express';
import { requireUser, requireInstructor, requireStudent } from '../controllers/authController.js';
import { 
    getResponsesByQuery, 
    respondToQuery, 
    editResponse, 
    deleteResponse 
} from '../controllers/responseController.js';

const router = express.Router();

// Get all responses for a specific query (students & instructors)
router.get('/query/:queryId', requireUser, getResponsesByQuery);

// Instructors/Admin: respond to a query
router.post('/:queryId', requireUser, requireInstructor, respondToQuery);

// Instructors/Admin: edit a response
router.put('/edit/:id', requireUser, requireInstructor, editResponse);

// Instructors/Admin: delete a response
router.delete('/delete/:id', requireUser, requireInstructor, deleteResponse);

export default router;
