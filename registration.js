document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const message = document.getElementById('message');
    const errorMessage = document.getElementById('error-message');

    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Create a FormData object from the form
        const formData = new FormData(registrationForm);

        // Send the form data to register.php
        fetch('register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Clear form
                registrationForm.reset();
                // Show success message
                message.innerText = data.message;
                message.style.display = 'block';
                errorMessage.style.display = 'none';
            } else {
                // Show error message
                errorMessage.innerText = data.message;
                errorMessage.style.display = 'block';
                message.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.innerText = 'An unexpected error occurred.';
            errorMessage.style.display = 'block';
            message.style.display = 'none';
        });
    });
});
