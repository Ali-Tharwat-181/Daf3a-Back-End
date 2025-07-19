import { createPaymentIntent } from '../services/payment.service.js';

export const createPaymentIntentController = async (req, res, next) => {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
        return res.status(400).json({ success: false, message: 'Amount and currency are required' });
    }

    try {
        const clientSecret = await createPaymentIntent(amount, currency);
        return res.status(200).json({ success: true, clientSecret });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
