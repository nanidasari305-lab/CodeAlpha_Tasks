const API_URL = '/api';

const api = {
    async getProducts(category = '') {
        const url = category ? `${API_URL}/products?category=${category}` : `${API_URL}/products`;
        const response = await fetch(url);
        return await response.json();
    },

    async getProduct(id) {
        const response = await fetch(`${API_URL}/products/${id}`);
        return await response.json();
    },

    async register(userData) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    async login(credentials) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        return await response.json();
    },

    async createOrder(orderData, token) {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(orderData)
        });
        return await response.json();
    },

    async getOrders(token) {
        const response = await fetch(`${API_URL}/orders`, {
            headers: { 'x-auth-token': token }
        });
        return await response.json();
    }
};
