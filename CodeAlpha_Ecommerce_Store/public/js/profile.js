document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('aurora_user'));
    const token = localStorage.getItem('aurora_token');

    if (!user || !token) {
        window.location.href = 'auth.html';
        return;
    }

    // Initial check handled by common.js

    // Update User Info
    const userInfo = document.getElementById('user-info');
    userInfo.textContent = `${user.username} | ${user.email}`;

    // Load Orders
    const container = document.getElementById('orders-container');
    try {
        const orders = await api.getOrders(token);
        if (orders.length === 0) {
            container.innerHTML = '<div class="glass" style="padding: 3rem; text-align: center;">No orders yet. <a href="index.html#products" class="text-gradient">Start shopping</a></div>';
        } else {
            container.innerHTML = orders.map(order => `
                <div class="glass order-card">
                    <div class="order-header">
                        <div>
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">Order ID: #${order.id}</span>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">${new Date(order.created_at).toLocaleDateString()}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; font-size: 1.2rem; color: var(--accent-secondary);">$${order.total_price.toFixed(2)}</div>
                            <span style="font-size: 0.8rem; background: rgba(0, 210, 255, 0.1); color: var(--accent-secondary); padding: 2px 8px; border-radius: 4px; text-transform: uppercase;">${order.status}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        ${order.items.map(item => `
                            <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.03); padding: 0.5rem; border-radius: 8px;">
                                <img src="${item.image_url}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
                                <span style="font-size: 0.85rem;">${item.name} (x${item.quantity})</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        container.innerHTML = '<p>Error loading orders.</p>';
    }

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('aurora_token');
        localStorage.removeItem('aurora_user');
        window.location.href = 'index.html';
    });
});
