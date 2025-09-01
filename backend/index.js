require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const db = require('./database.js');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
const allowedOrigins = [
    'http://localhost:5173', // For local development
    'https://oralvis-healthcare.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// --- Cloudinary Config ---
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// --- Multer Config (for file uploads) ---
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Authentication Middleware ---
const auth = (roles = []) => (req, res, next) => {
    const token = req.cookies.token; // Read token from req.cookies

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (roles.length > 0 && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have the required role." });
        }
        
        next();
    } catch (ex) {
        res.status(400).json({ message: "Invalid token." });
    }
};


// --- API Endpoints ---

// POST /api/login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.cookie('token', token, {
            httpOnly: true, 
            secure: true, 
            sameSite: 'none',
            maxAge: 3600000 // 1 hour
        }).json({
            message: "Logged in successfully",
            role: user.role // Still send role for frontend routing
        });
    });
});

// GET /api/verify
app.get('/api/verify', auth(), (req, res) => {
    res.json({ loggedIn: true, role: req.user.role });
});


// POST /api/logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token').json({ message: "Logged out successfully" });
});

// POST /api/upload - Protected for Technicians
app.post('/api/upload', auth(['Technician']), upload.single('scanImage'), async (req, res) => {
    const { patientName, patientId, scanType, region } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No image file provided.' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: 'oralvis_scans' }, (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
            uploadStream.end(file.buffer);
        });

        const imageUrl = result.secure_url;
        const uploadDate = new Date().toISOString();

        const sql = 'INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, uploadDate) VALUES (?,?,?,?,?,?)';
        const params = [patientName, patientId, scanType, region, imageUrl, uploadDate];

        db.run(sql, params, function(err) {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({ message: 'Scan uploaded successfully!', id: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading to Cloudinary', error });
    }
});

// GET /api/scans - Protected for Dentists
app.get('/api/scans', auth(['Dentist']), (req, res) => {
    const sql = "SELECT * FROM scans ORDER BY uploadDate DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
          res.status(400).json({ "error": err.message });
          return;
        }
        res.json({ scans: rows });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});