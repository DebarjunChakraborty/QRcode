document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!sessionStorage.getItem('loggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    const studentForm = document.getElementById('studentForm');
    const studentsTableBody = document.querySelector('#studentsTable tbody');
    const attendanceTableBody = document.querySelector('#attendanceTable tbody');
    const studentActivationTableBody = document.querySelector('#studentActivationTable tbody');
    const addButton = document.getElementById('addButton');
    const updateButton = document.getElementById('updateButton');
    const scanQrButton = document.getElementById('scanQrButton');
    const qrReader = document.getElementById('qr-reader');
    let students = [];
    let attendance = [];
    let editingStudentIndex = null;
    let attendanceSet = new Set();
    let html5QrCodeScanner;

    // Load unapproved students
    loadUnapprovedStudents();

    studentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const studentName = document.getElementById('studentName').value;
        const studentAge = document.getElementById('studentAge').value;

        if (editingStudentIndex !== null) {
            students[editingStudentIndex] = { name: studentName, age: studentAge };
            editingStudentIndex = null;
            updateButton.style.display = 'none';
            addButton.style.display = 'block';
        } else {
            students.push({ name: studentName, age: studentAge });
        }

        studentForm.reset();
        renderStudents();
    });

    studentsTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit')) {
            const index = event.target.dataset.index;
            const student = students[index];
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentAge').value = student.age;
            editingStudentIndex = index;
            updateButton.style.display = 'block';
            addButton.style.display = 'none';
        }

        if (event.target.classList.contains('delete')) {
            const index = event.target.dataset.index;
            students.splice(index, 1);
            renderStudents();
        }

        if (event.target.classList.contains('generate-qr')) {
            const index = event.target.dataset.index;
            generateQRCode(index);
        }

        if (event.target.classList.contains('download')) {
            const index = event.target.dataset.index;
            downloadStudentPDF(index);
        }
    });

    studentActivationTableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('approve')) {
            const index = event.target.dataset.index;
            approveStudent(index);
        }
    });

    scanQrButton.addEventListener('click', () => {
        qrReader.style.display = 'block';
        startQRScanner();
    });

    function renderStudents() {
        studentsTableBody.innerHTML = '';
        students.forEach((student, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>
                    <div class="qr-code" id="qrcode-${index}"></div>
                </td>
                <td>
                    <button class="edit btn btn-warning btn-sm" data-index="${index}">Edit</button>
                    <button class="delete btn btn-danger btn-sm" data-index="${index}">Delete</button>
                    <button class="generate-qr btn btn-info btn-sm" data-index="${index}">Generate QR</button>
                    <button class="download btn btn-secondary btn-sm" data-index="${index}">Download PDF</button>
                </td>
            `;
            studentsTableBody.appendChild(tr);
            generateQRCode(index);
        });
    }

    function generateQRCode(index) {
        const student = students[index];
        const qrcodeContainer = document.getElementById(`qrcode-${index}`);
        qrcodeContainer.innerHTML = '';
        new QRCode(qrcodeContainer, {
            text: `Name: ${student.name}, Age: ${student.age}`,
            width: 150,
            height: 150,
        });
    }

    function downloadStudentPDF(index) {
        const student = students[index];
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text(`Name: ${student.name}`, 10, 10);
        doc.text(`Age: ${student.age}`, 10, 20);
        const qrcodeContainer = document.getElementById(`qrcode-${index}`).querySelector('img');
        doc.addImage(qrcodeContainer.src, 'PNG', 10, 30, 50, 50);
        doc.save(`${student.name}_QR.pdf`);
    }

    function startQRScanner() {
        if (html5QrCodeScanner) {
            html5QrCodeScanner.clear();
        }
        html5QrCodeScanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );
        html5QrCodeScanner.render(onScanSuccess, onScanFailure);
    }

    function onScanSuccess(decodedText) {
        if (!attendanceSet.has(decodedText)) {
            const [name, age] = decodedText.split(", ").map(item => item.split(": ")[1]);
            markAttendance(name, age);
            attendanceSet.add(decodedText);
            setTimeout(() => attendanceSet.delete(decodedText), 60000);
            html5QrCodeScanner.clear();
            qrReader.style.display = 'none';
        }
    }

    function onScanFailure(error) {
        console.warn(`QR Code scan error: ${error}`);
    }

    function markAttendance(name, age) {
        const student = students.find(student => student.name === name && student.age === age);
        if (student) {
            const time = new Date().toLocaleString();
            attendance.push({ name, age, time });
            renderAttendance();
            alert(`Attendance marked for ${name}, Age: ${age} at ${time}`);
        } else {
            alert("Student not found.");
        }
    }

    function renderAttendance() {
        attendanceTableBody.innerHTML = '';
        attendance.forEach((entry) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${entry.name}</td>
                <td>${entry.age}</td>
                <td>${entry.time}</td>
            `;
            attendanceTableBody.appendChild(tr);
        });
    }

    function loadUnapprovedStudents() {
        const unapprovedStudents = JSON.parse(localStorage.getItem('unapprovedStudents')) || [];
        studentActivationTableBody.innerHTML = '';
        unapprovedStudents.forEach((student, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${student.name}</td>
                <td>${student.rollNumber}</td>
                <td>${student.email}</td>
                <td>
                    <button class="approve btn btn-success btn-sm" data-index="${index}">Approve</button>
                </td>
            `;
            studentActivationTableBody.appendChild(tr);
        });
    }

    function approveStudent(index) {
        const unapprovedStudents = JSON.parse(localStorage.getItem('unapprovedStudents')) || [];
        const approvedStudent = unapprovedStudents.splice(index, 1)[0];
        localStorage.setItem('unapprovedStudents', JSON.stringify(unapprovedStudents));

        let approvedStudents = JSON.parse(localStorage.getItem('approvedStudents')) || [];
        approvedStudents.push(approvedStudent);
        localStorage.setItem('approvedStudents', JSON.stringify(approvedStudents));

        loadUnapprovedStudents();
        alert(`Student ${approvedStudent.name} approved successfully.`);
    }

    renderStudents();
    renderAttendance();
});
