// Shared UI Logic
function handleHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

async function updateCartCountShared() {
    const cart = JSON.parse(localStorage.getItem('aurora_cart') || '[]');
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalItems;
    }
}

function checkAuthShared() {
    const user = JSON.parse(localStorage.getItem('aurora_user'));
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        if (user) {
            authLink.textContent = 'Profile';
            authLink.href = 'profile.html';
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'auth.html';
        }
    }
}

// Export to global scope
window.ui = {
    handleHeaderScroll,
    updateCartCount: updateCartCountShared,
    checkAuth: checkAuthShared
};

document.addEventListener('DOMContentLoaded', () => {
    window.ui.updateCartCount();
    window.ui.checkAuth();

    window.addEventListener('scroll', window.ui.handleHeaderScroll);
    window.ui.handleHeaderScroll(); // Initial check
});
