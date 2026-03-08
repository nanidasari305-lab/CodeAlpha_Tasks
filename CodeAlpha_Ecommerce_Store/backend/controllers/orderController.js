const { initDb } = require('../config/db');

const createOrder = async (req, res) => {
    const { items, totalPrice } = req.body;
    const userId = req.user.id;

    try {
        const db = await initDb();

        // Start transaction
        await db.run('BEGIN TRANSACTION');

        // Create order
        const result = await db.run(
            'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
            [userId, totalPrice]
        );
        const orderId = result.lastID;

        // Create order items
        for (const item of items) {
            await db.run(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );

            // Update stock
            await db.run(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.quantity, item.id]
            );
        }

        await db.run('COMMIT');
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (err) {
        try {
            const db = await initDb();
            await db.run('ROLLBACK');
        } catch (e) { }
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
};

const getOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const db = await initDb();
        const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);

        // Get items for each order
        for (let order of orders) {
            order.items = await db.all(`
                SELECT oi.*, p.name, p.image_url 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id = ?
            `, [order.id]);
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
};

module.exports = { createOrder, getOrders };
