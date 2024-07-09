document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const signupLink = document.getElementById('signup-link');
    const loginLink = document.getElementById('login-link');

    signupLink.addEventListener('click', showSignupForm);
    loginLink.addEventListener('click', showLoginForm);

    function showSignupForm(event) {
        event.preventDefault();
        mainContent.innerHTML = `
            <h2>Sign Up</h2>
            <form id="signup-form">
                <input type="text" id="signup-username" placeholder="Username" required>
                <input type="password" id="signup-password" placeholder="Password" required>
                <button type="submit">Sign Up</button>
            </form>
        `;
        document.getElementById('signup-form').addEventListener('submit', handleSignup);
    }

    function showLoginForm(event) {
        event.preventDefault();
        mainContent.innerHTML = `
            <h2>Login</h2>
            <form id="login-form">
                <input type="text" id="login-username" placeholder="Username" required>
                <input type="password" id="login-password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
        `;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }

    function handleSignup(event) {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        localStorage.setItem('user', JSON.stringify({ username, password }));
        alert('Sign up successful!');
        showProfilePage(username);
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username === username && storedUser.password === password) {
            alert('Login successful!');
            showProfilePage(username);
        } else {
            alert('Invalid username or password');
        }
    }

    function showProfilePage(username) {
        mainContent.innerHTML = `
            <h2>${username}'s Profile</h2>
            <form id="upload-form">
                <input type="file" id="profile-picture" accept="image/*" required>
                <button type="submit">Upload</button>
            </form>
            <div class="profile">
                <img id="profile-img" src="#" alt="Profile Picture" style="display: none;">
            </div>
        `;
        document.getElementById('upload-form').addEventListener('submit', handleUpload);
    }

    function handleUpload(event) {
        event.preventDefault();
        const fileInput = document.getElementById('profile-picture');
        const profileImg = document.getElementById('profile-img');
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            profileImg.src = e.target.result;
            profileImg.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});
