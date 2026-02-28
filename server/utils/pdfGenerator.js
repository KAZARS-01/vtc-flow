const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generates a PDF Mission Order (Bon de Commande) in compliance with French law L3121-2
 */
const generateMissionOrderPDF = async (document_id, bookingData, compliance_hash) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });

            // Ensure docs directory exists
            const docsDir = path.join(__dirname, '../public/docs');
            if (!fs.existsSync(docsDir)) {
                fs.mkdirSync(docsDir, { recursive: true });
            }

            const fileName = `bc_${document_id}.pdf`;
            const filePath = path.join(docsDir, fileName);

            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Header
            doc.fontSize(20).text('BON DE COMMANDE / MISSION ORDER', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text('Conformément à l\'Article L3121-2 du Code des Transports (France)', { align: 'center' });
            doc.moveDown(2);

            // Company Info (Placeholder for VTC-Flow)
            doc.fontSize(12).text('ENTREPRISE VTC:', { underline: true });
            doc.fontSize(10).text('Nom: VTC-Flow Operator');
            doc.text('SIRET: XXX XXX XXX XXXXX');
            doc.moveDown();

            // Driver Info
            doc.fontSize(12).text('CHAUFFEUR:', { underline: true });
            doc.fontSize(10).text(`ID Chauffeur: ${bookingData.driver_id}`);
            // In a real app, we'd fetch driver details from DB here.
            doc.moveDown();

            // Client Info
            doc.fontSize(12).text('CLIENT:', { underline: true });
            doc.fontSize(10).text(`Nom: ${bookingData.client_details?.name || 'Inconnu'}`);
            doc.text(`Téléphone: ${bookingData.client_details?.phone || 'Inconnu'}`);
            doc.moveDown();

            // Route and Timing (Crucial for compliance)
            doc.fontSize(12).text('DÉTAILS DE LA COURSE:', { underline: true });
            doc.fontSize(10).text(`Lieu de prise en charge: ${bookingData.route?.pickup_address}`);
            doc.text(`Lieu de dépose: ${bookingData.route?.dropoff_address}`);
            doc.text(`Date et Heure (Prise en charge): ${bookingData.route?.pickup_time}`);
            doc.text(`Date et Heure (Réservation): ${new Date().toISOString()}`); // Must be prior to pickup
            doc.moveDown(2);

            // Compliance Hash Footer
            doc.fontSize(8);
            doc.text('---------------------------------------------------------');
            doc.text(`ID Document: ${document_id}`);
            doc.text(`Hash de conformité (SHA-256): ${compliance_hash}`);
            doc.text('Ce document a été généré électroniquement et ne nécessite pas de signature physique.');

            doc.end();

            stream.on('finish', () => {
                resolve(`/docs/${fileName}`);
            });
            stream.on('error', (err) => {
                reject(err);
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateMissionOrderPDF };
