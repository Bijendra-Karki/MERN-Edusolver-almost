import express from 'express';
import { requireUser, requireInstructor, requireStudent } from '../controllers/authController.js';
import { submitQuery, getQueries, getQueryById, editQuery, deleteQuery } from '../controllers/queryController.js';
import { getResponsesByQuery, respondToQuery, editResponse, deleteResponse } from '../controllers/responseController.js';

const router = express.Router();

// Students: manage queries
router.post('/submit', requireUser, requireStudent, submitQuery);
router.put('/edit/:id', requireUser, requireStudent, editQuery);
router.delete('/delete/:id', requireUser, requireStudent, deleteQuery);
router.get('/:id', requireUser, getQueryById);
router.get('/:id/responses', requireUser, getResponsesByQuery);

// Instructors/Admin: respond & edit responses
router.post('/:queryId/respond', requireUser, requireInstructor, respondToQuery);
router.put('/response/edit/:id', requireUser, requireInstructor, editResponse);
router.delete('/response/delete/:id', requireUser, requireInstructor, deleteResponse);

// Admin/Instructors: view all queries
router.get('/', requireUser, requireInstructor, getQueries);

export default router;
