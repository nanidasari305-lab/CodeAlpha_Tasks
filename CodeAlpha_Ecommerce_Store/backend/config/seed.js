const { initDb } = require('./db');

async function seed() {
    const db = await initDb();

    // Clear existing products
    await db.run('DELETE FROM products');
    console.log('Cleared existing products');

    const products = [
        // Men's Collection
        {
            name: 'Elite Tailored Blazer',
            description: 'A masterpiece of Italian tailoring, perfect for formal evenings.',
            price: 850.00,
            category: 'Men',
            stock: 12,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1594932224016-9d10ad27707e?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Urban Tech Parka',
            description: 'Breathable, waterproof, and designed for the urban explorer.',
            price: 450.00,
            category: 'Men',
            stock: 20,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Heritage Chelsea Boots',
            description: 'Handcrafted leather boots that age beautifully over time.',
            price: 320.00,
            category: 'Men',
            stock: 15,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1635338148301-49651c6b1a77?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Oxford Signature Shirt',
            description: 'Premium Egyptian cotton shirt for a crisp, professional look.',
            price: 180.00,
            category: 'Men',
            stock: 30,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Shadow Slim Denim',
            description: 'High-stretch, ink-black denim for unparalleled comfort and style.',
            price: 220.00,
            category: 'Men',
            stock: 25,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Midnight Velvet Tuxedo',
            description: 'The ultimate statement piece for black-tie events.',
            price: 1500.00,
            category: 'Men',
            stock: 5,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Merino Wool Cardigan',
            description: 'Luxurious merino wool for sophisticated layering.',
            price: 280.00,
            category: 'Men',
            stock: 15,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1614972242802-9111242dd7de?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Nappa Leather Jacket',
            description: 'Buttery soft nappa leather with artisanal finish.',
            price: 950.00,
            category: 'Men',
            stock: 10,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=800'
        },

        // Women's Collection
        {
            name: 'Midnight Silk Gown',
            description: 'Flowing silk gown that captures the essence of evening elegance.',
            price: 1200.00,
            category: 'Women',
            stock: 8,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Cashmere Cloud Sweater',
            description: 'The softest cashmere imaginable, dyed in a timeless neutral palette.',
            price: 550.00,
            category: 'Women',
            stock: 18,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Stiletto Leather Heels',
            description: 'Handcrafted in Spain, these heels redefine comfort and luxury.',
            price: 480.00,
            category: 'Women',
            stock: 10,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Petal Print Sun Dress',
            description: 'A light, airy sundress perfect for summer afternoon soirées.',
            price: 360.00,
            category: 'Women',
            stock: 22,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Modern Wool Coat',
            description: 'Architectural silhouette meets warmth in this premium wool blend.',
            price: 890.00,
            category: 'Women',
            stock: 12,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Emerald Satin Wrap Dress',
            description: 'Lustrous satin wrap dress in a deep emerald hued.',
            price: 420.00,
            category: 'Women',
            stock: 15,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Pearl Drop Earrings',
            description: 'Classic Akoya pearls set in 18k white gold.',
            price: 650.00,
            category: 'Women',
            stock: 20,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Linen Belted Jumpsuit',
            description: 'Effortless luxury in breathable Italian linen.',
            price: 380.00,
            category: 'Women',
            stock: 25,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97cdca?auto=format&fit=crop&q=80&w=800'
        },

        // Accessories & Watches
        {
            name: 'Nebula GMT Watch',
            description: 'A precision timepiece with a dual-timezone complication and sapphire crystal.',
            price: 1250.00,
            category: 'Watches',
            stock: 5,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Lunar Chronograph',
            description: 'Inspired by space exploration, this watch features a moonphase dial.',
            price: 2400.00,
            category: 'Watches',
            stock: 3,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1547996160-81dfa63595dd?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Royal Sunray Watch',
            description: 'Gold-plated luxury timepiece with a sunray dial pattern.',
            price: 1800.00,
            category: 'Watches',
            stock: 7,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Obsidian Leather Tote',
            description: 'Spacious yet sleek, the perfect companion for the busy professional.',
            price: 680.00,
            category: 'Accessories',
            stock: 15,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Sapphire Silk Scarf',
            description: 'Hand-painted silk scarf with rich jewel tones and intricate patterns.',
            price: 220.00,
            category: 'Accessories',
            stock: 40,
            is_featured: 1,
            image_url: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800'
        },
        {
            name: 'Platinum Aviators',
            description: 'Premium titanium sunglasses with polarized platinum-mirrored lenses.',
            price: 350.00,
            category: 'Accessories',
            stock: 25,
            is_featured: 0,
            image_url: 'https://images.unsplash.com/photo-1511499767350-a1590fdb7301?auto=format&fit=crop&q=80&w=800'
        }
    ];

    for (const product of products) {
        await db.run(
            'INSERT INTO products (name, description, price, category, stock, is_featured, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [product.name, product.description, product.price, product.category, product.stock, product.is_featured, product.image_url]
        );
    }

    console.log('Seeding completed');
    await db.close();
}

seed().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
