function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('aurora_cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('aurora_cart', JSON.stringify(cart));

    // Use shared UI update
    if (window.ui) window.ui.updateCartCount();

    // Simple feedback
    alert(`${product.name} added to cart!`);
}

// Render Products
async function loadProducts(category = '') {
    const container = document.getElementById('products-container');
    if (!container) return;

    try {
        console.log(`Fetching products for category: "${category}"`);
        let products = await api.getProducts(category);
        console.log(`Received ${products.length} products`);

        // Apply Sorting
        const sortBy = document.getElementById('sort-products')?.value || 'newest';
        if (sortBy === 'price-low') {
            products.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            products.sort((a, b) => b.price - a.price);
        } else {
            products.sort((a, b) => b.id - a.id); // Default to newest
        }

        // Update Section Title
        const titleEl = document.querySelector('.section-title');
        if (titleEl) {
            titleEl.textContent = category ? `${category} Collection` : 'Featured Collections';
        }

        if (products.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem;">No products found in this category.</div>';
            return;
        }

        container.innerHTML = products.map((product, index) => `
            <div class="product-card fade-in">
                ${product.is_featured ? '<div class="featured-badge">Featured</div>' : ''}
                <a href="product-details.html?id=${product.id}">
                    <img src="${product.image_url}" alt="${product.name}" class="product-image">
                </a>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
                <button class="add-to-cart" id="add-btn-${product.id}">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        `).join('');

        // Attach listeners securely instead of using inline onclick
        products.forEach(product => {
            const btn = document.getElementById(`add-btn-${product.id}`);
            if (btn) {
                btn.onclick = () => addToCart(product);
            }
        });
    } catch (err) {
        container.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

// Global handle for add to cart
window.handleAddToCart = (id, name, price, image_url) => {
    addToCart({ id, name, price, image_url });
};

// Redundant checkAuth removed, handled by common.js

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Category Filter Listeners
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Load filtered products
            const category = btn.dataset.category;
            loadProducts(category);
        });
    });

    // Sort Listener
    const sortSelect = document.getElementById('sort-products');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const activeBtn = document.querySelector('.filter-btn.active');
            const category = activeBtn ? activeBtn.dataset.category : '';
            loadProducts(category);
        });
    }
});
