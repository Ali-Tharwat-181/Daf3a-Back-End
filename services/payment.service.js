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

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);  // Ensure your environment variable is using your TEST SECRET KEY


export const createStudentStripeCustomer = async (studentEmail, cardDetails) => {
    try {
        // Create a payment method with test card details
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: '4242424242424242', // Test card number
                exp_month: 12, // Expiry month (e.g., 12 for December)
                exp_year: 2024, // Expiry year (e.g., 2024)
                cvc: '123', // Test CVC
            },
        });

        // Create the customer and attach the payment method
        const customer = await stripe.customers.create({
            email: studentEmail, // Student's email
            payment_method: paymentMethod.id, // Attach the payment method to the customer
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
        });

        console.log('Created student customer:', customer.id);
        return customer.id; // This is the studentStripeId
    } catch (error) {
        console.error('Error creating student customer:', error);
    }
};


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

export const createPaymentIntent = async (amount, currency, studentEmail, mentorId) => {
    try {
        // Step 1: Create Stripe Customer for the Student (if not exists)
        const student = await User.findOne({ email: studentEmail });
        let studentStripeId = student.stripeCustomerId;
        if (!studentStripeId) {
            const customer = await stripe.customers.create({
                email: studentEmail,
            });
            studentStripeId = customer.id;
            student.stripeCustomerId = studentStripeId;
            await student.save();
        }

        // Step 2: Create Stripe Account for the Mentor (if not exists)
        const mentor = await User.findById(mentorId);
        let mentorStripeId = mentor.stripeAccountId;
        if (!mentorStripeId) {
            // Create a Stripe Express account for the mentor
            const account = await stripe.accounts.create({
                type: 'express', // or 'standard'
                country: 'US',  // Set mentor's country
                email: mentor.email,  // Mentor's email
            });
            mentorStripeId = account.id;
            mentor.stripeAccountId = mentorStripeId;
            await mentor.save();
        }

        // Step 3: Create the Payment Intent (charge the student)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: currency,
            customer: studentStripeId, // The student's Stripe ID
            payment_method_types: ['card'], // Assuming only card payments
            transfer_data: {
                destination: mentorStripeId, // Transfer funds to the mentor
            },
        });

        return {
            clientSecret: paymentIntent.client_secret,
            studentStripeId,
            mentorStripeId,
        };
    } catch (error) {
        console.error('Error creating Payment Intent:', error);
        throw new Error(error.message);
    }
};
