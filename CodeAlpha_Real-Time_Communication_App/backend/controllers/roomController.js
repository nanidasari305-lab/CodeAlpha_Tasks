const Room = require('../models/Room');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
const createRoom = async (req, res) => {
    try {
        const { name } = req.body;
        const roomId = uuidv4(); // Generate a unique Room ID

        const room = await Room.create({
            roomId,
            name: name || 'Meeting Room',
            creator: req.user._id,
        });

        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join an existing room
// @route   POST /api/rooms/join
// @access  Private
const joinRoom = async (req, res) => {
    try {
        const { roomId } = req.body;
        
        const room = await Room.findOne({ roomId });
        
        if (room) {
            // Optional: you can add the user to the participants list here
            // But we'll mostly handle participants via socket.io
            res.json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all active rooms (optional feature)
// @route   GET /api/rooms
// @access  Private
const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate('creator', 'username');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createRoom, joinRoom, getRooms };
