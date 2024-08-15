<?php
// register.php

$servername = "localhost";
$username = "root";
$password = ""; // Default password for XAMPP
$dbname = "attendance_system"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure the form data is present
if (isset($_POST['rollNumber']) && isset($_POST['name']) && isset($_POST['email']) && isset($_POST['password'])) {
    $rollNumber = $_POST['rollNumber'];
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash password

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO studentActivationTable (roll_number, name, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $rollNumber, $name, $email, $password);

    if ($stmt->execute()) {
        echo '<script>document.getElementById("message").style.display = "block";</script>';
    } else {
        echo '<script>document.getElementById("error-message").style.display = "block";</script>';
    }

    $stmt->close();
} else {
    echo '<script>document.getElementById("error-message").style.display = "block";</script>';
}

$conn->close();
 
