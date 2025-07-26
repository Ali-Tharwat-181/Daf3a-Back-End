import express from 'express';
import { createPaymentIntentController, createStripeAccountLinkController } from '../controllers/payment.controller.js';
import authMiddleware from '../middlewares/auth.js';

const paymentRouter = express.Router();

paymentRouter.post('/create-payment-intent', authMiddleware, createPaymentIntentController);

paymentRouter.post("/create-stripe-account-link", authMiddleware, createStripeAccountLinkController);



export default paymentRouter;
