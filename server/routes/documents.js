const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { db } = require('../config/db');
const { generateMissionOrderPDF, generateInvoicePDF, generateQuotePDF } = require('../utils/pdfGenerator');

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

module.exports = router;
