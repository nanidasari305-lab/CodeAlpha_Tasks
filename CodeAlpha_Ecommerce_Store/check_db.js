const { initDb } = require('./backend/config/db');

async function checkProducts() {
    const db = await initDb();
    const products = await db.all('SELECT * FROM products');
    console.log('Total Products:', products.length);
    console.log('Categories found:', [...new Set(products.map(p => p.category))]);
    console.log('First 5 products:', JSON.stringify(products.slice(0, 5), null, 2));
    await db.close();
}

checkProducts().catch(console.error);
