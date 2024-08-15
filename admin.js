document.addEventListener('DOMContentLoaded', () => {
    const scanQRCodeButton = document.getElementById('scanQRCodeButton');
    const qrScanner = document.getElementById('qrScanner');
    const attendanceTable = document.getElementById('attendanceTable');
    const logoutButton = document.getElementById('logoutButton');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');


    // Update Attendance Table
    function updateAttendanceTable() {
        fetch('get-attendance.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                attendanceTable.innerHTML = ''; // Clear existing table content
                data.attendance.forEach(record => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${record.roll_number}</td><td>${record.name}</td><td>${record.timestamp}</td>`;
                    attendanceTable.appendChild(row);
                });
            } else {
                errorMessage.innerText = 'Failed to fetch attendance records.';
                errorMessage.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.innerText = 'An unexpected error occurred while fetching records.';
            errorMessage.style.display = 'block';
        });
    }

    // Logout Functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('loggedIn');
            window.location.href = 'index.html'; // Redirect to home page
        });
    }
});
