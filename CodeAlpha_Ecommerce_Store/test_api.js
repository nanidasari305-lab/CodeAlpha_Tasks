const fetch = require('node-fetch');

async function testApi() {
    const categories = ['', 'Men', 'Women'];
    for (const cat of categories) {
        const url = cat ? `http://localhost:5000/api/products?category=${cat}` : 'http://localhost:5000/api/products';
        try {
            const resp = await fetch(url);
            const products = await resp.json();
            console.log(`Category "${cat || 'All'}": found ${products.length} products`);
        } catch (e) {
            console.error(`Failed to fetch for category "${cat}":`, e.message);
        }
    }
}

testApi();
