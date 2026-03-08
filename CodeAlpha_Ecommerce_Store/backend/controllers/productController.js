const { initDb } = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const db = await initDb();
        const { category } = req.query;
        console.log(`[API] Fetching products. Category: ${category || 'All'}`);

        let query = 'SELECT * FROM products';
        let params = [];

        if (category) {
            query += ' WHERE category = ?';
            params.push(category);
        }

        const products = await db.all(query, params);
        console.log(`[API] Found ${products.length} products`);
        res.json(products);
    } catch (err) {
        console.error('[API Error] fetching products:', err);
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const db = await initDb();
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product', error: err.message });
    }
};

module.exports = { getProducts, getProductById };
