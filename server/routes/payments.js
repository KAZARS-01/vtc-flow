const express = require('express');
const router = express.Router();
// Use your secret key here securely from env (sk_test_...)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_vtcflow1234');

// POST /api/v1/payments/create-intent
router.post('/create-intent', async (req, res) => {
    try {
        const { amount, currency = 'eur', booking_id } = req.body;

        if (!amount) {
            return res.status(400).json({ status: 'error', message: 'Amount is required' });
        }

        // Convert to cents (e.g. 65.00 EUR -> 6500)
        const amountInCents = Math.round(Number(amount) * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: currency,
            metadata: { booking_id },
            payment_method_types: ['card', 'sepa_debit', 'ideal'], // European methods
        });

        res.status(200).json({
            status: 'success',
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
