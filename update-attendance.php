<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$qrData = $input['qrData'] ?? '';

if ($qrData) {
    // Assuming you have a connection to your database already set up
    $conn = new mysqli('localhost', 'root', '', 'attendance_system');

    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Database connection failed']);
        exit();
    }

    // Prepare statement to insert attendance
    $stmt = $conn->prepare("INSERT INTO attendancetable (roll_number, name, timestamp) VALUES (?, ?, NOW())");
    // You need to parse the QR data to get roll_number and name
    // Assuming $qrData contains roll_number and name separated by a comma
    list($roll_number, $name) = explode(',', $qrData);

    $stmt->bind_param('ss', $roll_number, $name);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to insert record']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'No QR data received']);
} 