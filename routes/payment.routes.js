import express from 'express';
import { createPaymentIntentController } from '../controllers/payment.controller.js';
import authMiddleware from '../middlewares/auth.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-payment-intent', authMiddleware, createPaymentIntentController);

export default paymentRouter;
