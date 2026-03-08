const { initDb } = require('./backend/config/db');

async function migrate() {
    const db = await initDb();
    try {
        await db.run('ALTER TABLE products ADD COLUMN is_featured INTEGER DEFAULT 0');
        console.log('Added is_featured column to products table');
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('is_featured column already exists');
        } else {
            console.error('Migration failed:', err);
        }
    }
    await db.close();
}

migrate();
