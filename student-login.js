document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Send the form data to login.php
        fetch('login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `studentmain.html?email=${encodeURIComponent(email)}`;
            } else if (data.approved === false) {
                alert('Wait for approval.');
            } else {
                errorMessage.textContent = 'Incorrect email or password.';
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An unexpected error occurred.';
            errorMessage.style.display = 'block';
        });
    });
});
