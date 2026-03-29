const ui = {
    init() {
        // Dark mode setup
        const isDark = localStorage.getItem('theme') === 'dark';
        if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
        
        document.getElementById('theme-btn').addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });

        // Close dropdown when clicking outside
        window.onclick = (event) => {
            if (!event.target.matches('.avatar-small') && !event.target.closest('.modal-content')) {
                const dropdowns = document.getElementsByClassName("dropdown-menu");
                for (let i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (!openDropdown.classList.contains('hidden')) {
                        openDropdown.classList.add('hidden');
                    }
                }
            }
        };

        // File upload preview
        const createPostImgInput = document.getElementById('post-image');
        if(createPostImgInput) {
            createPostImgInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.getElementById('image-preview');
                        preview.innerHTML = `<img src="${e.target.result}" style="width:100px; height:auto; border-radius:5px;">`;
                        preview.classList.remove('hidden');
                    }
                    reader.readAsDataURL(file);
                }
            });
        }
    },

    showModal(id) {
        document.getElementById(id).classList.add('show');
        this.clearErrors();
    },

    hideModal(id) {
        document.getElementById(id).classList.remove('show');
    },

    toggleDropdown() {
        document.getElementById('profile-dropdown-menu').classList.toggle('hidden');
    },

    setLoggedInState() {
        document.getElementById('logged-out-nav').classList.add('hidden');
        document.getElementById('logged-in-nav').classList.remove('hidden');
        if(auth.user && auth.user.profilePic) {
             document.getElementById('nav-profile-pic').src = `http://localhost:5000${auth.user.profilePic}`;
        }
        app.loadFeed();
        app.loadSuggestions();
    },

    setLoggedOutState() {
        document.getElementById('logged-in-nav').classList.add('hidden');
        document.getElementById('logged-out-nav').classList.remove('hidden');
        
        // Show welcome message instead of feed
        document.getElementById('feed-container').innerHTML = `
            <div class="card text-center" style="padding: 40px;">
                <h2>Welcome to SocialApp</h2>
                <p>Please login or register to see posts.</p>
                <div class="mt-1">
                    <button class="btn btn-primary" onclick="ui.showModal('login-modal')">Login</button>
                </div>
            </div>
        `;
        document.getElementById('suggestion-list').innerHTML = '';
    },

    showError(elementId, message) {
        const el = document.getElementById(elementId);
        el.innerText = message;
        el.classList.remove('hidden');
    },

    clearErrors() {
        const errors = document.querySelectorAll('.error-msg');
        errors.forEach(el => el.classList.add('hidden'));
    },
    
    showLoader() {
        document.getElementById('feed-loader').classList.remove('hidden');
    },
    
    hideLoader() {
        document.getElementById('feed-loader').classList.add('hidden');
    }
};
