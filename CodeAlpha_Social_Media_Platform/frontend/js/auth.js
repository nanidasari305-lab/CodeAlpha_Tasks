const auth = {
    user: null,

    init() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.user = JSON.parse(storedUser);
            ui.setLoggedInState();
        } else {
            ui.setLoggedOutState();
        }
    },

    async login(email, password) {
        try {
            const data = await api.request('/auth/login', 'POST', { email, password });
            this.setSession(data.token, data.user);
            return true;
        } catch (err) {
            ui.showError('login-error', err.message);
            return false;
        }
    },

    async register(username, email, password) {
        try {
            const data = await api.request('/auth/register', 'POST', { username, email, password });
            this.setSession(data.token, data.user);
            return true;
        } catch (err) {
            ui.showError('reg-error', err.message);
            return false;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.user = null;
        ui.setLoggedOutState();
    },

    setSession(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.user = user;
        ui.setLoggedInState();
    }
};
