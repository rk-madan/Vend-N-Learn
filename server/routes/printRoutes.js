const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // pdf, doc, docx, images
    const allowed = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    }
    cb('Error: File type not supported');
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }
    res.send(`File uploaded successfully: ${req.file.path}`);
    // In a real app, you would send this to a printer queue
});

module.exports = router;
