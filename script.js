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
            </form>
        `;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.username === username && storedUser.password === password) {
            alert('Login successful!');
            showFeedPage();
        } else {
            alert('Invalid username or password');
        }
    }

    function showFeedPage() {
        mainContent.innerHTML = `
            <div class="container-flex">
                <div class="menu">
                    <ul>
                        <li>Profile</li>
                        <li>Recommendations</li>
                        <li>Subscriptions</li>
                        <li>Wallet</li>
                    </ul>
                </div>
                <div class="feed">
                    <div class="post">
                        <img src="https://via.placeholder.com/800x400" alt="Post 1">
                        <div class="actions">
                            <button class="like-button">Like</button>
                            <button class="comment-button">Comment</button>
                        </div>
                    </div>
                    <div class="post">
                        <img src="https://via.placeholder.com/800x400" alt="Post 2">
                        <div class="actions">
                            <button class="like-button">Like</button>
                            <button class="comment-button">Comment</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const likeButtons = document.querySelectorAll('.like-button');
        const commentButtons = document.querySelectorAll('.comment-button');

        likeButtons.forEach(button => button.addEventListener('click', handleLike));
        commentButtons.forEach(button => button.addEventListener('click', handleComment));
    }

    function handleLike(event) {
        alert('You liked the post!');
    }

    function handleComment(event) {
        alert('You clicked comment!');
    }
});
