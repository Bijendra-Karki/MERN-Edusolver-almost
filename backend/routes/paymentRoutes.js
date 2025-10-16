// paymentRoutes.js
import express from 'express';
import { 
    // Removed generateSignature from imports
    initiatePayment, 
    verifyPaymentAndEnroll, 
    getPayments, 
    getPaymentById, 
    updatePayment, 
    deletePayment, 
    // generateSignature // Removed
} from '../controllers/paymentController.js';
// ✅ IMPORT YOUR MIDDLEWARE HERE
import { requireSignin, requireAdmin } from '../controllers/authController.js'; 


const router = express.Router();

// -----------------------------------------------------------
// PAYMENT FLOW ROUTES
// -----------------------------------------------------------

// POST /api/payments/initiate - Creates DB record, generates signature, and returns eSewa form data.
router.post('/initiate', requireSignin, initiatePayment); 

// GET /api/payments/verify - External endpoint, NO AUTH NEEDED (Called by eSewa/user browser redirect)
router.get('/verify', verifyPaymentAndEnroll); 

// Removed the redundant router.post('/generateSignature', requireSignin, generateSignature);


// -----------------------------------------------------------
// CRUD/ADMIN ROUTES (Remain Unchanged)
// -----------------------------------------------------------

// GET /api/payments/paymentList - Get all payments (Admin only)
router.get('/paymentList', requireSignin, requireAdmin, getPayments);

// GET /api/payments/paymentDetails/:id - Get payment details by ID (User/Admin)
router.get('/paymentDetails/:id', requireSignin, getPaymentById);

// PUT /api/payments/paymentUpdate/:id - Update payment (Admin only)
router.put('/paymentUpdate/:id', requireSignin, requireAdmin, updatePayment);

// DELETE /api/payments/paymentDelete/:id - Delete payment (Admin only)
router.delete('/paymentDelete/:id', requireSignin, requireAdmin, deletePayment);


export default router;