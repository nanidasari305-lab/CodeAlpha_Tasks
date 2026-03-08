const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initDb } = require('./backend/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Database and Start Server
initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
});

// Routes
app.use('/api/products', require('./backend/routes/productRoutes'));
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/orders', require('./backend/routes/orderRoutes'));

// Basic Route for testing
app.get('/api/health', (req, res) => {
    res.json({ status: 'up', message: 'E-commerce API is running' });
});
