const Payment = require("../models/payment");
const dotenv = require("dotenv");
const grpc = require('@grpc/grpc-js');
const Stripe = require("stripe");
dotenv.config();

const stripe = Stripe(process.env.KEY);

async function processPayment(call, callback) {
    const { bookingId, amount, userEmail, cardDetails } = call.request;

    // Input validation
    if (!bookingId || !amount || !userEmail || !cardDetails) {
        return callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: "Invalid input data",
        });
    }

    try {
        // Create a payment method using card details
        // const paymentMethod = await stripe.paymentMethods.create({
        //     type: "card",
        //     card: {
        //         number: cardDetails.number,
        //         exp_month: cardDetails.exp_month,
        //         exp_year: cardDetails.exp_year,
        //         cvc: cardDetails.cvc,
        //     },
        // });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, 
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never", // Prevent redirect-based methods
            },
            metadata: {
                bookingId: bookingId,
            },
        });

        // Save payment details in the database
        const payment = new Payment({
            bookingId,
            amount,
            userEmail,
            transactionId: paymentIntent.id,
            status: "completed",
        });

        await payment.save();

        // Send a success response to the gRPC client
        callback(null, {
            success: true,
            transactionId: paymentIntent.id,
            message: "Payment processed successfully",
        });
    } catch (error) {
        console.error("Payment processing error:", error.message);

        // Send an error response to the gRPC client
        callback({
            code: grpc.status.INTERNAL,
            message: `Payment processing failed: ${error.message}`,
        });
    }
}

module.exports = { processPayment };
