import express from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create-order', verifyUser, createPaymentOrder);
router.post('/verify', verifyUser, verifyPayment);

export default router;