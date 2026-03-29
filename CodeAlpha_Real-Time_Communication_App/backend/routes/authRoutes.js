const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.get('/profile', protect, getUserProfile); // To be added when middleware is created

module.exports = router;
