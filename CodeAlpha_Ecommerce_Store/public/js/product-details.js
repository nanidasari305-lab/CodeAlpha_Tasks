document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
});

async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const container = document.getElementById('product-details');

    if (!productId) {
        container.innerHTML = '<p>Product not found.</p>';
        return;
    }

    try {
        const product = await api.getProduct(productId);
        container.innerHTML = `
            <div class="product-details-image">
                <img src="${product.image_url}" alt="${product.name}">
            </div>
            <div class="product-info-full">
                <div class="product-category" style="font-size: 1rem;">${product.category}</div>
                <h1>${product.name}</h1>
                <p style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 2rem;">
                    ${product.description}
                </p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div style="margin-bottom: 2.5rem;">
                    <span style="background: var(--glass-bg); padding: 0.5rem 1rem; border-radius: 12px; border: 1px solid var(--glass-border);">
                        ${product.stock > 0 ? product.stock + ' available' : 'Out of stock'}
                    </span>
                </div>
                <button class="btn-primary" onclick="handleAddToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" ${product.stock <= 0 ? 'disabled' : ''}>
                    ${product.stock > 0 ? 'Add to Shopping Bag' : 'Out of Stock'}
                </button>
            </div>
        `;
    } catch (err) {
        container.innerHTML = '<p>Error loading product details.</p>';
    }
}

function handleAddToCart(product) {
    let cart = JSON.parse(localStorage.getItem('aurora_cart')) || [];
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('aurora_cart', JSON.stringify(cart));

    // Update UI
    if (window.ui) window.ui.updateCartCount();
    alert(`${product.name} added to cart!`);
}
