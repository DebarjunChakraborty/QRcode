<?php
// activation.php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "attendance_system";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle student registration
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if all POST variables are set
    if (isset($_POST['roll_number']) && isset($_POST['name']) && isset($_POST['email']) && isset($_POST['password'])) {
        $roll_number = $_POST['roll_number'];
        $name = $_POST['name'];
        $email = $_POST['email'];
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

        // Insert student details into studentActivationTable
        $sql = "INSERT INTO studentActivationTable (roll_number, name, email, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $roll_number, $name, $email, $password);

        if ($stmt->execute()) {
            echo "Registration successful. Awaiting admin approval.";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "All fields are required.";
    }
}

$conn->close(); 
header("Location: student-registration.html");
exit();