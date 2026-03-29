const File = require('../models/File');
const fs = require('fs');
const path = require('path');

// @desc    Upload a file
// @route   POST /api/files/upload
// @access  Private
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({ message: 'Room ID is required' });
        }

        const fileData = await File.create({
            fileName: req.file.originalname,
            fileUrl: `/uploads/${req.file.filename}`,
            roomId,
            uploaderId: req.user._id,
            uploaderName: req.user.username,
            size: req.file.size
        });

        // Normally we'd use Socket.io to notify users here, but we can do it from the frontend as well
        res.status(201).json(fileData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get files by room
// @route   GET /api/files/:roomId
// @access  Private
const getFilesByRoom = async (req, res) => {
    try {
        const files = await File.find({ roomId: req.params.roomId }).sort({ createdAt: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadFile, getFilesByRoom };
