<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "attendance_system";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $action = $_POST['action'];

    if ($action == 'approve') {
        // Move details from studentActivationTable to studentsTable
        $sql = "SELECT * FROM studentActivationTable WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();

        $sql = "INSERT INTO studentsTable (roll_number, name, email, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $row['roll_number'], $row['name'], $row['email'], $row['password']);
        $stmt->execute();
        $stmt->close();

        // Delete from studentActivationTable
        $sql = "DELETE FROM studentActivationTable WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();

        echo "Student approved and activated.";
    } elseif ($action == 'reject') {
        // Remove from studentActivationTable
        $sql = "DELETE FROM studentActivationTable WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();

        echo "Student rejected.";
    }
}

$conn->close();
 
