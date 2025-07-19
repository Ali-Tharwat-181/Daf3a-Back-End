import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const SecretKey = process.env.STRIPE_SECRET_KEY;
if (!SecretKey) {
    throw new Error("Stripe Secret Key is not defined in environment variables");
} else {
    console.log("Stripe Secret Key is defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Express Account for Mentor
export const createStripeAccount = async (user) => {
    const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
        capabilities: { transfers: { requested: true } }
    });
    return account.id;
};

// Generate Onboarding Link for Mentor
export const generateOnboardingLink = async (accountId) => {
    const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: process.env.CLIENT_URL + '/dashboard',
        return_url: process.env.CLIENT_URL + '/dashboard',
        type: 'account_onboarding',
    });
    return accountLink.url;
};

// Create Customer for Student
export const createCustomer = async (user) => {
    const customer = await stripe.customers.create({ email: user.email });
    return customer.id;
};

// Create Checkout Session for Booking
export const createCheckoutSession = async ({ amount, customerId, mentorStripeAccountId }) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'google_pay', 'apple_pay'],
        mode: 'payment',
        customer: customerId,
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: { name: 'Mentorship Session Booking' },
                unit_amount: amount * 100,
            },
            quantity: 1,
        }],
        payment_intent_data: {
            application_fee_amount: (amount * 0.1) * 100, // 10% platform fee
            transfer_data: { destination: mentorStripeAccountId },
        },
        success_url: `${process.env.CLIENT_URL}/payment-success`,
        cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });
    return session.url;
};
