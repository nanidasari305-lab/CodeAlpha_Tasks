document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('aurora_user'));
    const authLink = document.getElementById('auth-link');
    if (user && authLink) {
        authLink.textContent = 'Profile';
        authLink.href = 'profile.html';
    }
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('aurora_cart')) || [];
    const container = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 3rem;">Your bag is empty. <a href="index.html#products" class="text-gradient">Explore products</a></div>';
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        if (cartCount) cartCount.textContent = '0';
        document.getElementById('checkout-btn').disabled = true;
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${item.name}</h4>
                    <div style="color: var(--accent-secondary); font-weight: 600;">$${item.price.toFixed(2)}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <button onclick="updateQuantity(${index}, -1)" class="glass" style="width: 32px; height: 32px; border-radius: 8px;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${index}, 1)" class="glass" style="width: 32px; height: 32px; border-radius: 8px;">+</button>
                    <button onclick="removeFromCart(${index})" style="color: #ff4d4d; margin-left: 1rem;"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');

    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

window.updateQuantity = (index, delta) => {
    let cart = JSON.parse(localStorage.getItem('aurora_cart')) || [];
    cart[index].quantity += delta;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem('aurora_cart', JSON.stringify(cart));
    renderCart();
};

window.removeFromCart = (index) => {
    let cart = JSON.parse(localStorage.getItem('aurora_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('aurora_cart', JSON.stringify(cart));
    renderCart();
};

document.getElementById('checkout-btn').addEventListener('click', async () => {
    const user = JSON.parse(localStorage.getItem('aurora_user'));
    const token = localStorage.getItem('aurora_token');

    if (!user || !token) {
        alert('Please login to complete your order.');
        window.location.href = 'auth.html?redirect=cart.html';
        return;
    }

    const cart = JSON.parse(localStorage.getItem('aurora_cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        const result = await api.createOrder({
            items: cart,
            totalPrice: total
        }, token);

        if (result.orderId) {
            alert('Order placed successfully! Order ID: ' + result.orderId);
            localStorage.removeItem('aurora_cart');
            window.location.href = 'profile.html';
        } else {
            alert('Error creating order: ' + result.message);
        }
    } catch (err) {
        alert('Checkout failed.');
    }
});
