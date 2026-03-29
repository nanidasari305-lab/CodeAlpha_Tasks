const app = {
    async init() {
        ui.init();
        auth.init();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Auth Forms
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if (await auth.login(email, password)) {
                ui.hideModal('login-modal');
                e.target.reset();
            }
        });

        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            if (await auth.register(username, email, password)) {
                ui.hideModal('register-modal');
                e.target.reset();
            }
        });

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            auth.logout();
        });

        // Post Form
        document.getElementById('create-post-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = document.getElementById('post-content').value;
            const imageFile = document.getElementById('post-image').files[0];
            
            const formData = new FormData();
            formData.append('content', content);
            if (imageFile) formData.append('image', imageFile);

            try {
                const btn = document.getElementById('create-post-btn');
                btn.disabled = true;
                btn.innerText = 'Posting...';

                await api.request('/posts', 'POST', formData, true);
                ui.hideModal('create-post-modal');
                e.target.reset();
                document.getElementById('image-preview').classList.add('hidden');
                document.getElementById('image-preview').innerHTML = '';
                this.loadFeed(); // Reload feed
            } catch (err) {
                alert(err.message);
            } finally {
                const btn = document.getElementById('create-post-btn');
                btn.disabled = false;
                btn.innerText = 'Post';
            }
        });

        // Navigation links
        document.getElementById('home-link').addEventListener('click', () => {
            this.loadFeed();
        });
        document.getElementById('sidebar-profile-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.loadProfile(auth.user.id);
        });
        document.getElementById('profile-link').addEventListener('click', (e) => {
            e.preventDefault();
            this.loadProfile(auth.user.id);
        });
    },

    async loadFeed() {
        if (!auth.user) return;
        ui.showLoader();
        try {
            const posts = await api.request('/posts/feed');
            this.renderPosts(posts, document.getElementById('feed-container'));
        } catch (err) {
            console.error('Error loading feed:', err);
        } finally {
            ui.hideLoader();
        }
    },

    async loadProfile(userId) {
        if (!auth.user) return;
        ui.showLoader();
        const container = document.getElementById('feed-container');
        try {
            const user = await api.request(`/users/${userId}`);
            const posts = await api.request(`/users/${userId}/posts`);
            
            let profileHtml = `
                <div class="card profile-header">
                    <img src="${user.profilePic ? `http://localhost:5000${user.profilePic}` : 'https://via.placeholder.com/100'}" class="avatar-large" alt="${user.username}">
                    <h2 class="mt-1">${user.username}</h2>
                    <p class="text-secondary">${user.bio || 'No bio yet.'}</p>
                    
                    <div class="profile-stats">
                        <div class="stat-item">
                            <div class="stat-value">${posts.length}</div>
                            <div class="stat-label">Posts</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${user.followers.length}</div>
                            <div class="stat-label">Followers</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${user.following.length}</div>
                            <div class="stat-label">Following</div>
                        </div>
                    </div>
            `;
            
            if (auth.user.id === userId) {
                profileHtml += `<button class="btn btn-outline mt-1" onclick="app.showEditProfile('${user.username}', '${user.bio}')">Edit Profile</button>`;
            } else {
                const isFollowing = user.followers.includes(auth.user.id);
                profileHtml += `<button class="btn ${isFollowing ? 'btn-outline' : 'btn-primary'} mt-1" onclick="app.toggleFollow('${userId}', this)">
                                    ${isFollowing ? 'Unfollow' : 'Follow'}
                                </button>`;
            }
            
            profileHtml += `</div>`;
            
            // Append posts
            container.innerHTML = profileHtml;
            const postsWrapper = document.createElement('div');
            this.renderPosts(posts, postsWrapper, false);
            container.appendChild(postsWrapper);
            
        } catch (err) {
            container.innerHTML = `<p>Error loading profile</p>`;
        } finally {
            ui.hideLoader();
        }
    },

    renderPosts(posts, container, clear = true) {
        if (clear) container.innerHTML = '';
        if (posts.length === 0) {
            container.innerHTML += `<div class="card text-center"><p>No posts to show.</p></div>`;
            return;
        }

        posts.forEach(post => {
            const isLiked = post.likes.includes(auth.user.id);
            const date = new Date(post.createdAt).toLocaleDateString();
            const time = new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            let postHtml = `
                <div class="post" id="post-${post._id}">
                    <div class="post-header">
                        <img src="${post.userId.profilePic ? `http://localhost:5000${post.userId.profilePic}` : 'https://via.placeholder.com/40'}" class="avatar-small" onclick="app.loadProfile('${post.userId._id}')">
                        <div class="post-meta">
                            <h4 onclick="app.loadProfile('${post.userId._id}')">${post.userId.username}</h4>
                            <span>${date} ${time}</span>
                        </div>
                    </div>
                    <div class="post-content">${this.escapeHtml(post.content)}</div>
            `;

            if (post.image) {
                postHtml += `<img src="http://localhost:5000${post.image}" class="post-image" alt="Post Request">`;
            }

            postHtml += `
                    <div class="post-actions">
                        <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="app.toggleLike('${post._id}', this)">
                            <i class="fas fa-thumbs-up"></i> <span class="like-count">${post.likes.length}</span>
                        </button>
                        <button class="action-btn" onclick="app.toggleComments('${post._id}')">
                            <i class="fas fa-comment"></i> Comment
                        </button>
                    </div>
                    <div class="comments-section hidden" id="comments-${post._id}">
                        <div class="comments-list" id="comments-list-${post._id}">
                            <!-- Comments injected here -->
                        </div>
                        <div class="comment-input-area">
                            <img src="${auth.user.profilePic ? `http://localhost:5000${auth.user.profilePic}` : 'https://via.placeholder.com/30'}" class="comment-avatar">
                            <input type="text" class="comment-input" id="comment-input-${post._id}" placeholder="Write a comment..." onkeypress="app.handleCommentInput(event, '${post._id}')">
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += postHtml;
        });
    },

    async toggleLike(postId, btnElement) {
        try {
            const likesCount = await api.request(`/posts/${postId}/like`, 'POST');
            const span = btnElement.querySelector('.like-count');
            span.innerText = likesCount.length;
            
            if (likesCount.includes(auth.user.id)) {
                btnElement.classList.add('liked');
            } else {
                btnElement.classList.remove('liked');
            }
        } catch (err) {
            console.error('Error liking post:', err);
        }
    },

    async toggleComments(postId) {
        const section = document.getElementById(`comments-${postId}`);
        if (section.classList.contains('hidden')) {
            section.classList.remove('hidden');
            await this.loadComments(postId);
        } else {
            section.classList.add('hidden');
        }
    },

    async loadComments(postId) {
        try {
            const comments = await api.request(`/comments/post/${postId}`);
            const list = document.getElementById(`comments-list-${postId}`);
            list.innerHTML = '';
            comments.forEach(c => {
                list.innerHTML += `
                    <div class="comment">
                        <img src="${c.userId.profilePic ? `http://localhost:5000${c.userId.profilePic}` : 'https://via.placeholder.com/30'}" class="comment-avatar">
                        <div class="comment-body">
                            <span class="comment-author">${c.userId.username}</span>
                            <span class="comment-text">${this.escapeHtml(c.text)}</span>
                        </div>
                    </div>
                `;
            });
        } catch (err) {
            console.error('Error loading comments', err);
        }
    },

    async handleCommentInput(event, postId) {
        if (event.key === 'Enter') {
            const input = document.getElementById(`comment-input-${postId}`);
            const text = input.value.trim();
            if(!text) return;
            
            try {
                await api.request('/comments', 'POST', { postId, text });
                input.value = '';
                await this.loadComments(postId); // Refresh comments
            } catch (err) {
                console.error(err);
            }
        }
    },

    async toggleFollow(userId, btnElement) {
        try {
            const result = await api.request(`/users/${userId}/follow`, 'POST');
            const isFollowing = result.following.includes(userId);
            if (isFollowing) {
                btnElement.innerText = 'Unfollow';
                btnElement.className = 'btn btn-outline mt-1';
            } else {
                btnElement.innerText = 'Follow';
                btnElement.className = 'btn btn-primary mt-1';
            }
        } catch (err) {
            console.error('Error following', err);
        }
    },

    showEditProfile(username, bio) {
        document.getElementById('edit-username').value = username;
        document.getElementById('edit-bio').value = bio && bio !== 'undefined' ? bio : '';
        ui.showModal('edit-profile-modal');
        
        document.getElementById('edit-profile-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('username', document.getElementById('edit-username').value);
            formData.append('bio', document.getElementById('edit-bio').value);
            
            const file = document.getElementById('edit-profile-pic').files[0];
            if(file) formData.append('profilePic', file);
            
            try {
                const user = await api.request('/users/profile', 'PUT', formData, true);
                auth.user.profilePic = user.profilePic;
                auth.user.username = user.username;
                localStorage.setItem('user', JSON.stringify(auth.user));
                ui.hideModal('edit-profile-modal');
                this.loadProfile(auth.user.id);
            } catch (err) {
                alert('Error updating profile');
            }
        };
    },
    
    // Very basic placeholder for suggestions
    loadSuggestions() {
        const list = document.getElementById('suggestion-list');
        list.innerHTML = `
            <div style="padding: 10px; font-size: 0.9rem; color: var(--text-secondary);">
                Suggestions will appear here as the network grows.
            </div>
        `;
    },

    // XSS Prevention
    escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
};

// Start application
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});
