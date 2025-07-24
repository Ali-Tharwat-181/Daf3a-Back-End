import Stripe from 'stripe';
import dotenv from 'dotenv';
import User from '../models/User.js';
dotenv.config();

const SecretKey = process.env.STRIPE_SECRET_KEY;
if (!SecretKey) {
    throw new Error("Stripe Secret Key is not defined in environment variables");
} else {
    console.log("Stripe Secret Key is defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  // Ensure your environment variable is using your TEST SECRET KEY

// Create Stripe Express Account for Mentor in Test Mode
export const createStripeAccountForMentor = async (mentorId) => {
    console.log("Creating Stripe account for mentor  services", mentorId);
    const mentor = await User.findById(mentorId);
    console.log("Mentor found:", mentor);
    if (!mentor) {
        console.log("Mentor not found for ID:", mentorId);
    }

    try {
        // Step 1: Create Stripe account for the mentor
        console.log("Creating Stripe account for mentor:", mentorId);
        const account = await stripe.accounts.create({
            type: 'express',  // or 'standard'
            business_type: 'individual', // or 'company'
            country: 'US',  // or use the mentor's country
            email: mentor.email,  // Add mentor's email
        });
        if (!account) {
            console.log('Failed to create Stripe account for mentor:', mentorId);
            return null;
        }
        // Step 2: Save the Stripe Account ID to the mentor's record in the database
        const mentor = await User.findById(mentorId);
        if (!mentor) {
            throw new Error("Mentor not found");
        }

        mentor.stripeAccountId = account.id;  // Save the Stripe Account ID to mentor's record
        await mentor.save();

        console.log(`Stripe Account ID for mentor ${mentorId} saved: ${account.id}`);
        return account.id;
    } catch (error) {
        console.error("Error creating Stripe account for mentor:", error);
        console.error("Full error:", error.raw);  // Log the full error for better debugging
        throw new Error("Error creating Stripe account for mentor");
    }
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
