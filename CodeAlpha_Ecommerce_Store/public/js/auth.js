let isLogin = true;

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-auth');
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const usernameField = document.getElementById('username-field');
    const submitBtn = document.getElementById('submit-btn');
    const toggleText = document.getElementById('toggle-text');

    if (!toggleBtn || !authForm) return;

    toggleBtn.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Please enter your details to login.';
            usernameField.style.display = 'none';
            submitBtn.textContent = 'Login';
            toggleText.textContent = "Don't have an account?";
            toggleBtn.textContent = 'Sign Up';
        } else {
            authTitle.textContent = 'Join Aurora';
            authSubtitle.textContent = 'Start your premium experience today.';
            usernameField.style.display = 'block';
            submitBtn.textContent = 'Create Account';
            toggleText.textContent = "Already have an account?";
            toggleBtn.textContent = 'Login';
        }
    });

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const username = document.getElementById('username')?.value;

        try {
            if (isLogin) {
                const result = await api.login({ email, password });
                if (result.token) {
                    localStorage.setItem('aurora_token', result.token);
                    localStorage.setItem('aurora_user', JSON.stringify(result.user));

                    // Update shared UI state
                    if (window.ui) window.ui.checkAuth();

                    alert('Login successful!');

                    const params = new URLSearchParams(window.location.search);
                    const redirect = params.get('redirect');
                    window.location.href = redirect || 'index.html';
                } else {
                    alert(result.message || 'Login failed');
                }
            } else {
                const result = await api.register({ username, email, password });
                if (result.message === 'User registered successfully') {
                    alert('Registration successful! Please login.');
                    toggleBtn.click();
                } else {
                    alert(result.message || 'Registration failed');
                }
            }
        } catch (err) {
            alert('Authentication error occurred.');
        }
    });
});
