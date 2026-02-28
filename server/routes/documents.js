const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { db } = require('../config/db');
const { generateMissionOrderPDF, generateInvoicePDF, generateQuotePDF } = require('../utils/pdfGenerator');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

// POST /api/v1/documents/generate-mission-order
router.post('/generate-mission-order', async (req, res) => {
    try {
        const { booking_id, driver_id, client_details, route } = req.body;

        // Hash creation for Legal Proof (SHA-256)
        const dataToHash = `${booking_id}-${driver_id}-${new Date().toISOString()}`;
        const compliance_hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        // Generate physical PDF file
        const docId = `doc-${Date.now()}`;
        const pdf_path = await generateMissionOrderPDF(docId, req.body, compliance_hash);
        const pdf_url = `http://localhost:5001${pdf_path}`; // Using local dev server for now

        // Save to SQLite
        db.run(
            `INSERT INTO bookings (id, driver_id, client_name, pickup_address, dropoff_address, status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [booking_id, driver_id, client_details?.name || 'Inconnu', route?.pickup_address, route?.dropoff_address, 'CONFIRMED'],
            (err) => {
                if (err) console.error('DB Insert Error:', err.message);
            }
        );

        res.status(200).json({
            status: 'success',
            data: {
                document_id: docId,
                pdf_url,
                generated_at: new Date().toISOString(),
                compliance_hash
            }
        });
    } catch (error) {
        console.error('Error generating document:', error);
        res.status(500).json({ status: 'error', message: 'Failed to generate mission order.' });
    }
});

// POST /api/v1/documents/generate-invoice
router.post('/generate-invoice', async (req, res) => {
    try {
        const { booking_id, client_details, amount } = req.body;
        const invoice_number = `F-${Date.now()}`;

        const pdf_path = await generateInvoicePDF(invoice_number, req.body);
        const pdf_url = `http://localhost:5001${pdf_path}`;

        db.run(
            `INSERT INTO invoices (id, booking_id, invoice_number, client_name, amount, status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [`inv-${Date.now()}`, booking_id, invoice_number, client_details?.name || 'Inconnu', amount || 65.00, 'PAID'],
            (err) => {
                if (err) console.error('DB Insert Error:', err.message);
            }
        );

        res.status(200).json({ status: 'success', data: { invoice_number, pdf_url } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to generate invoice.' });
    }
});

// POST /api/v1/documents/generate-quote
router.post('/generate-quote', async (req, res) => {
    try {
        const { client_details, amount } = req.body;
        const quote_number = `D-${Date.now()}`;

        const pdf_path = await generateQuotePDF(quote_number, req.body);
        const pdf_url = `http://localhost:5001${pdf_path}`;

        db.run(
            `INSERT INTO quotes (id, quote_number, client_name, amount, status) 
             VALUES (?, ?, ?, ?, ?)`,
            [`quo-${Date.now()}`, quote_number, client_details?.name || 'Inconnu', amount || 65.00, 'PENDING'],
            (err) => {
                if (err) console.error('DB Insert Error:', err.message);
            }
        );

        res.status(200).json({ status: 'success', data: { quote_number, pdf_url } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to generate quote.' });
    }
});

// POST /api/v1/documents/send-email
router.post('/send-email', async (req, res) => {
    try {
        const { email, document_url, document_type } = req.body;

        if (!process.env.RESEND_API_KEY) {
            console.log(`\n[MOCK EMAIL] Sent ${document_type} to ${email} with link ${document_url}\n`);
            return res.status(200).json({ status: 'success', message: 'Mock email sent (API Key missing)' });
        }

        const { data, error } = await resend.emails.send({
            from: 'VTC-Flow <onboarding@resend.dev>',
            to: [email],
            subject: `Votre ${document_type} - VTC-Flow`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h3>Bonjour,</h3>
                    <p>Veuillez trouver ci-joint votre document légal (${document_type}):</p>
                    <a href="${document_url}" style="display:inline-block; padding:10px 20px; background:#00E676; color:#000; text-decoration:none; border-radius:5px; font-weight:bold;">Télécharger le PDF</a>
                    <p style="margin-top:20px; color:#888;">Merci de votre confiance. <br/>L'équipe VTC-Flow.</p>
                </div>
            `
        });

        if (error) {
            return res.status(400).json({ status: 'error', message: error.message });
        }

        res.status(200).json({ status: 'success', data });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send email.' });
    }
});

module.exports = router;
