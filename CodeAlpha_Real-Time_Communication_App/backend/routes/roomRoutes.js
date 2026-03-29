const express = require('express');
const router = express.Router();
const { createRoom, joinRoom, getRooms } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createRoom)
    .get(protect, getRooms);

router.post('/join', protect, joinRoom);

module.exports = router;
