import { createPaymentIntent, createStripeAccountLinkService } from '../services/payment.service.js';

export const createPaymentIntentController = async (req, res, next) => {
    console.log("Creating payment intent with data:", req.body);
    const { amount, currency, studentEmail, mentorId } = req.body;

    if (!amount || !currency || !studentEmail || !mentorId) {
        return res.status(400).json({ success: false, message: 'Amount, currency, student email, and mentor ID are required' });
    }

    try {
        // Create a Payment Intent
        const { clientSecret, studentStripeId, mentorStripeId } = await createPaymentIntent(amount, currency, studentEmail, mentorId);
        return res.status(200).json({ success: true, clientSecret, studentStripeId, mentorStripeId });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


export const createStripeAccountLinkController = async (req, res) => {
    try {
        const url = await createStripeAccountLinkService(req.user._id);
        res.json({ url });
    } catch (error) {
        console.error("Error creating Stripe onboarding link:", error.message);
        res.status(500).json({ error: "Failed to create Stripe onboarding link" });
    }
};
