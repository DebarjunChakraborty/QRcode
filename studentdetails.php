<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "attendance_system";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if (isset($_GET['email'])) {
    $email = $_GET['email'];

    $stmt = $conn->prepare("SELECT roll_number, name, email FROM studentsTable WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($roll_number, $name, $email);

    if ($stmt->fetch()) {
        echo json_encode([
            'roll_number' => $roll_number,
            'name' => $name,
            'email' => $email
        ]);
    } else {
        echo json_encode(['error' => 'Student not found']);
    }

    $stmt->close();
}

$conn->close(); 
