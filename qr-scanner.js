document.addEventListener('DOMContentLoaded', () => {
    const startScannerButton = document.getElementById('startScanner');
    const qrScanner = document.getElementById('qrScanner');
    const message = document.getElementById('message');
    const errorMessage = document.getElementById('error-message');
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    startScannerButton.addEventListener('click', () => {
        // Get user media (camera)
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                qrScanner.srcObject = stream;
                qrScanner.setAttribute('playsinline', true); // Required for iOS Safari
                qrScanner.play();

                requestAnimationFrame(scanQRCode);
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
                errorMessage.innerText = 'Error accessing camera.';
                errorMessage.style.display = 'block';
                message.style.display = 'none';
            });

        function scanQRCode() {
            if (qrScanner.readyState === qrScanner.HAVE_ENOUGH_DATA) {
                canvas.height = qrScanner.videoHeight;
                canvas.width = qrScanner.videoWidth;
                canvasContext.drawImage(qrScanner, 0, 0, canvas.width, canvas.height);
                const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, canvas.width, canvas.height, {
                    inversionAttempts: 'dontInvert',
                });

                if (code) {
                    message.innerText = 'QR Code scanned successfully!';
                    message.style.display = 'block';
                    errorMessage.style.display = 'none';

                    // Stop camera
                    qrScanner.srcObject.getTracks().forEach(track => track.stop());

                    // Send QR code data to the server
                    fetch('update-attendance.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ qrData: code.data })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Attendance updated successfully');
                        } else {
                            console.error('Failed to update attendance');
                        }
                    })
                    .catch(error => console.error('Error updating attendance:', error));
                } else {
                    errorMessage.style.display = 'none';
                    message.style.display = 'none';
                }
            }

            requestAnimationFrame(scanQRCode);
        }
    });
});
