const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');
const multer = require('multer');
const path = require('path');

// Store uploads in a temporary folder
const upload = multer({
    dest: path.join(__dirname, '../../tmp'),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'), false);
        }
        cb(null, true);
    },
});

// General ATS Checker (No Job Description)
router.post(
    '/general',
    upload.single('resume'),
    analyzeController.analyzeGeneral
);

// JD-Based ATS Optimizer (Requires Job Description)
router.post(
    '/tailored',
    upload.single('resume'),
    analyzeController.analyzeTailored
);

// Keep the old root endpoint for backward compatibility (optional but safe)
router.post(
    '/',
    upload.single('resume'),
    analyzeController.analyzeTailored
);

module.exports = router;
