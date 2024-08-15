document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (username === 'admin' && password === 'password') {
            console.log('Credentials are correct, setting session and redirecting...');
            sessionStorage.setItem('loggedIn', 'true');
            window.location.href = "admin.php";
        } else {
            console.log('Incorrect credentials.');
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Incorrect username or password.';
        }
    });
});
