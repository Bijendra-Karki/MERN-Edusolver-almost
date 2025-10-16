import express from 'express';
import { 
    getEnrollments, 
    getEnrollmentById, 
    getUserEnrollments,
    updateEnrollment, 
    deleteEnrollment,
} from '../controllers/enrollmentController.js';
import { requireAdmin, requireSignin } from '../controllers/authController.js';
// ✅ IMPORT YOUR MIDDLEWARE HERE


const router = express.Router();

// -----------------------------------------------------------
// USER ENROLLMENT ROUTES
// -----------------------------------------------------------

// GET /api/enroll/my - Get all enrollments for the logged-in user
// Secured: Only the signed-in user can access their own list.
router.get('/my', requireSignin, getUserEnrollments);

// GET /api/enroll/:id - Get a specific enrollment detail
// Secured: Authorization handled inside the controller (user or admin)
router.get('/:id', requireSignin, getEnrollmentById);


// -----------------------------------------------------------
// ADMIN/CRUD ROUTES
// -----------------------------------------------------------

// GET /api/enroll - Get ALL enrollments (Admin only)
router.get('/enrollList', requireSignin, requireAdmin, getEnrollments);

// PUT /api/enroll/:id - Update enrollment (e.g., changing status) (Admin only)
router.put('/enrollUpdate/:id', requireSignin, requireAdmin, updateEnrollment);

// DELETE /api/enroll/:id - Delete enrollment (Admin only)
router.delete('/enrollDelete/:id', requireSignin, requireAdmin, deleteEnrollment);


export default router;