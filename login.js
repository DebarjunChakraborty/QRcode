document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'password') {
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = 'admin.html';
        } else {
            errorMessage.style.display = 'block';
        }
    });
});
