import {Router} from "express";
import stripe from "../lib/stripe.js";

const router = Router();

router.get(
    "/checkout",
    async (req, res) => {
        res.send("Checking if this route works");
    },
);

router.post(
    "/checkout",
    async (req, res) => {
        const { email, price } = req.body;
        
        if (typeof price !== "number" || isNaN(price) || price <= 0) {
            return res.status(400).send({
               success: false,
                message: "Price is value is invalid",
            });
        }
        const priceInCents = Math.round((price * 100) + Number.EPSILON);
        
        try {
            const customer = await stripe.customers.create();
            const ephemeralKey = await stripe.ephemeralKeys.create(
                {
                    customer: customer.id,
                },
                {
                    apiVersion: "2025-11-17.clover",
                },
            );
            const paymentIntent = await stripe.paymentIntents.create({
               amount: priceInCents,
                currency: "EUR",
                customer: customer.id,
                automatic_payment_methods: {
                   enabled: true,
                },
                receipt_email: email,
                description: `${email}'s order`,
                metadata: {
                   email: email,
                },
            });
            
            return res.status(200).send({
                success: true,
                message: "Payment session created successfully",
                paymentIntent: paymentIntent.client_secret,
                ephemeralKey: ephemeralKey.secret,
                customer: customer.id,
            });
            
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).send({
                success: false,
                message: "Payment failed",
            });
        }
    },
);



export default router;