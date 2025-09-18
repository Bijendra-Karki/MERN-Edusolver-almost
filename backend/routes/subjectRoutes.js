import express from 'express';
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  updateRating,
} from '../controllers/subjectController.js';
import upload from '../middlerwares/upload.js'; // import the single multer instance
import { requireAdmin, requireUser } from '../controllers/authController.js';

const router = express.Router();

/* =========================
   ADMIN ROUTES
========================= */

// Create a new subject (with optional image + PDF)
router.post(
  '/createSubjects',
  requireUser,
  requireAdmin,
  upload.fields([
    { name: 'instructorAvatar', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'subjectFile', maxCount: 1 },
  ]),
  createSubject
);

// Update subject (Admin can update title, description, price, rating, enrolled, files)
router.put(
  '/updateSubjects/:id',
  requireUser,
  requireAdmin,
  upload.fields([
    { name: 'instructorAvatar', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'subjectFile', maxCount: 1 },
  ]),
  updateSubject
);

// Delete a subject
router.delete('/subjects/:id', requireUser, requireAdmin, deleteSubject);

/* =========================
   USER ROUTES
========================= */

// Get all subjects (users can view)
router.get('/subjectsList', getSubjects);

// Get single subject by ID (users can view)
router.get('/subjectsDetails/:id', getSubjectById);

// User submits rating
router.patch('/subjects/:id/rate', requireUser, updateRating);

export default router;