document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    showLoginForm();

    function showLoginForm() {
        mainContent.innerHTML = `
            <h2>Login</h2>
            <form id="login-form">
                <input type="text" id="login-username" placeholder="Username" required>
                <input type="password" id="login-password" placeholder="Password" required>
                <button type="submit">Login</button>
                <p>Don't have an account? <a href="#" id="show-signup">Sign up</a></p>
            </form>
        `;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
        document.getElementById('show-signup').addEventListener('click', showSignupForm);
    }

    function showSignupForm(event) {
        event.preventDefault();
        mainContent.innerHTML = `
            <h2>Sign Up</h2>
            <form id="signup-form">
                <input type="text" id="signup-username" placeholder="Username" required>
                <input type="password" id="signup-password" placeholder="Password" required>
                <button type="submit">Sign Up</button>
                <p>Already have an account? <a href="#" id="show-login">Log in</a></p>
            </form>
        `;
        document.getElementById('signup-form').addEventListener('submit', handleSignup);
        document.getElementById('show-login').addEventListener('click', showLoginForm);
    }

    function handleSignup(event) {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Sign up successful! Please log in.');
                showLoginForm();
            } else {
                alert('Error signing up. Please try again.');
            }
        });
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Login successful!');
                showProfileCreationPage(data.user);
            } else {
                alert('Invalid username or password');
            }
        });
    }

    function showProfileCreationPage(user) {
        mainContent.innerHTML = `
            <h2>Create Your Profile</h2>
            <form id="profile-form" enctype="multipart/form-data">
                <input type="hidden" name="userId" value="${user.id}">
                <input type="file" name="profilePicture" accept="image/*" required>
                <input type="text" name="firstName" placeholder="First Name" required>
                <input type="text" name="lastName" placeholder="Last Name" required>
                <input type="text" name="bio" placeholder="About You" required>
                <button type="submit">Create Profile</button>
            </form>
        `;
        document.getElementById('profile-form').addEventListener('submit', handleProfileCreation);
    }

    function handleProfileCreation(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        fetch('/createProfile', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Profile created successfully!');
                showMakeFirstPostPage(data.user);
            } else {
                alert('Error creating profile. Please try again.');
            }
        });
    }

    function showMakeFirstPostPage(user) {
        mainContent.innerHTML = `
            <h2>Make Your First Post</h2>
            <form id="post-form" enctype="multipart/form-data">
                <input type="hidden" name="userId" value="${user.id}">
                <input type="file" name="postImage" accept="image/*" required>
                <input type="text" name="description" placeholder="Description" required>
                <button type="submit">Post</button>
            </form>
            <div class="menu">
                <a href="#" onclick="showProfilePage(${user.id})">Profile</a>
                <a href="#">Subscriptions</a>
                <a href="#">Recommendations</a>
                <a href="#">Wallet</a>
            </div>
        `;
        document.getElementById('post-form').addEventListener('submit', handlePostCreation);
    }

    function handlePostCreation(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        fetch('/createPost', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Post created successfully!');
                // Here you can redirect to the feed or update the feed with the new post
            } else {
                alert('Error creating post. Please try again.');
            }
        });
    }

    function showProfilePage(userId) {
        fetch(`/getProfile/${userId}`)
            .then(response => response.json())
            .then(data => {
                mainContent.innerHTML = `
                    <h2>${data.firstName} ${data.lastName}'s Profile</h2>
                    <img src="${data.profilePicture}" alt="Profile Picture">
                    <p>${data.bio}</p>
                    <div class="menu">
                        <a href="#" onclick="showProfilePage(${userId})">Profile</a>
                        <a href="#">Subscriptions</a>
                        <a href="#">Recommendations</a>
                        <a href="#">Wallet</a>
                    </div>
                `;
            });
    }
});
