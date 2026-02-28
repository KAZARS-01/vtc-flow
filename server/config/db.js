const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to or create a local SQLite database file
const dbPath = path.resolve(__dirname, '../vtcflow.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('✅ Connected to local SQLite database.');

        // Create Tables if they don't exist
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      driver_id TEXT,
      client_name TEXT,
      pickup_address TEXT,
      dropoff_address TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    }
});

module.exports = { db };
