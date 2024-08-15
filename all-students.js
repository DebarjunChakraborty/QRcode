document.addEventListener('DOMContentLoaded', () => {
    const studentsTableBody = document.getElementById('students-table-body');

    // Fetch students from server
    fetch('get-students.php')
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                data.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.roll_number}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                    `;
                    studentsTableBody.appendChild(row);
                });
            } else {
                studentsTableBody.innerHTML = '<tr><td colspan="3">No students found</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            studentsTableBody.innerHTML = '<tr><td colspan="3">An error occurred while fetching data</td></tr>';
        });
});
