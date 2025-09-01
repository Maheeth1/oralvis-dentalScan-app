const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const DBSOURCE = process.env.DB_PATH || "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    } else {
        console.log('Connected to the SQLite database.');
        // Create users table
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE, 
            password TEXT, 
            role TEXT,
            CONSTRAINT email_unique UNIQUE (email)
            )`, (err) => {
            if (err) {
                // Table already created
            } else {
                // Table just created, creating default users
                const salt = bcrypt.genSaltSync(10);
                
                const technicianPassword = bcrypt.hashSync("password123", salt);
                db.run('INSERT INTO users (email, password, role) VALUES (?,?,?)', ["tech@oralvis.com", technicianPassword, "Technician"]);
                
                const dentistPassword = bcrypt.hashSync("password123", salt);
                db.run('INSERT INTO users (email, password, role) VALUES (?,?,?)', ["dentist@oralvis.com", dentistPassword, "Dentist"]);
                console.log('Default users created.');
            }
        });

        // Create scans table
        db.run(`CREATE TABLE scans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientName TEXT,
            patientId TEXT,
            scanType TEXT,
            region TEXT,
            imageUrl TEXT,
            uploadDate TEXT
        )`, (err) => {
            if (err) {
                // Table already created
            }
        });
    }
});

module.exports = db;