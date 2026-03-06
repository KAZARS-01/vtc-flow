const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../server/vtcflow.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Running Migration...');

db.serialize(() => {
    db.run(`ALTER TABLE bookings ADD COLUMN is_recurring INTEGER DEFAULT 0`, (err) => {
        if (err) console.log('Column is_recurring might already exist');
    });

    db.run(`ALTER TABLE bookings ADD COLUMN recurring_type TEXT`, (err) => {
        if (err) console.log('Column recurring_type might already exist');
        console.log('Migration Done.');
        process.exit(0);
    });
});
