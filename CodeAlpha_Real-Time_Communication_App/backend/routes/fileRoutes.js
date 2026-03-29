const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadFile, getFilesByRoom } = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

// Storage configuration for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload', protect, upload.single('file'), uploadFile);
router.get('/:roomId', protect, getFilesByRoom);

module.exports = router;
