document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    fetch(`studentdetails.php?email=${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('student-name').textContent = data.name;
            document.getElementById('student-roll-number').textContent = data.roll_number;
            document.getElementById('student-email').textContent = data.email;

            document.getElementById('generate-pdf').addEventListener('click', () => {
                generatePDF(data);
            });
        })
        .catch(error => console.error('Error:', error));
});

function generatePDF(studentData) {
    const { jsPDF } = window.jspdf;

    // Convert the student data to a JSON string
    const qrText = JSON.stringify({
        name: studentData.name,
        roll_number: studentData.roll_number,
        email: studentData.email
    });

    const qrCodeOptions = {
        text: qrText,
        width: 128,
        height: 128
    };

    // Generate QR code as a data URL
    QRCode.toDataURL(qrText, { width: qrCodeOptions.width, height: qrCodeOptions.height }, (err, url) => {
        if (err) {
            console.error('Error generating QR code:', err);
            return;
        }

        const doc = new jsPDF('p', 'mm', 'a4');
        doc.setFontSize(16);
        doc.text('Student ID Card', 10, 10);
        doc.text(`Name: ${studentData.name}`, 10, 20);
        doc.text(`Roll Number: ${studentData.roll_number}`, 10, 30);
        doc.text(`Email: ${studentData.email}`, 10, 40);
        doc.addImage(url, 'PNG', 10, 50, 50, 50);
        doc.save('student-id-card.pdf');
    });
}
