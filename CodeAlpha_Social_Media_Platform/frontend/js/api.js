const API_URL = 'http://localhost:5000/api';

const api = {
    // Get token from local storage
    getToken() {
        return localStorage.getItem('token');
    },

    // Set token in headers
    getHeaders(isFormData = false) {
        const headers = {};
        const token = this.getToken();
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }
        
        return headers;
    },

    // Helper for fetch requests
    async request(endpoint, method = 'GET', data = null, isFormData = false) {
        const config = {
            method,
            headers: this.getHeaders(isFormData)
        };

        if (data && !isFormData) {
            config.body = JSON.stringify(data);
        } else if (data && isFormData) {
            config.body = data;
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, config);
            const responseData = await response.json().catch(() => ({}));
            
            if (!response.ok) {
                throw new Error(responseData.message || 'Something went wrong');
            }
            
            return responseData;
        } catch (error) {
            throw error;
        }
    }
};
