require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'VTC-Flow API is running' });
});

app.get('/api/db-check', (req, res) => {
    db.get('SELECT datetime("now") as now', [], (err, row) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).json({ status: 'error', message: 'Database query failed' });
        }
        res.status(200).json({ status: 'success', db_time: row.now, message: 'SQLite ready' });
    });
});

// Import modular routes
const documentRoutes = require('./routes/documents');
const paymentRoutes = require('./routes/payments');

app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 VTC-Flow Backend running on port ${PORT}`);
});
