// attendancelog.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('fetch_attendance.php')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('attendance-log');
            tableBody.innerHTML = '';

            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.roll_number}</td>
                    <td>${entry.name}</td>
                    <td>${entry.timestamp}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching attendance data:', error));
});
