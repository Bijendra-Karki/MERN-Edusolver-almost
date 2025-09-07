import express from 'express';
import {
    requireUser,
    requireStudent,
    requireAdmin
} from '../controllers/authController.js';
import {
    createPayment,
    getPayments,
    getPaymentById
} from '../controllers/paymentController.js';

const router = express.Router();

// Students make payment
router.post('/create', requireUser, requireStudent, createPayment);

// Admin can view all payments
router.get('/', requireUser, requireAdmin, getPayments);
router.get('/:id', requireUser, requireAdmin, getPaymentById);

export default router;
