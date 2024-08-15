<!-- admin.php -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="admin.css">
    <script src="https://unpkg.com/html5-qrcode/minified/html5-qrcode.min.js"></script>
    <script src="admin.js" defer></script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">QR Code Attendance</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href="qr-scanner.html" >Scan QR Code</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="all-students.html">All Students</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="attendancelog.html">Attendance List</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="index.html" id="logoutButton">Logout</a>
                </li>
            </ul>
        </div>
    </nav>
 
    <div class="container mt-5">
        <h2>Student Activations</h2>
        <table class="table table-striped">
            <thead>
                <tr >
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>   
            </thead>
            <tbody>
                <?php
                // Database connection
                $conn = new mysqli('localhost', 'root', '', 'attendance_system');
                if ($conn->connect_error) {
                    die("Connection failed: " . $conn->connect_error);
                }

                // Fetch unapproved students
                $result = $conn->query("SELECT * FROM studentActivationTable");

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr>
                            <td>{$row['roll_number']}</td>
                            <td>{$row['name']}</td>
                            <td>{$row['email']}</td>
                            <td>
                                <form action='activate_student.php' method='post' style='display:inline;'>
                                    <input type='hidden' name='id' value='{$row['id']}'>
                                    <button type='submit' name='action' value='approve' class='btn btn-success btn-sm'>Approve</button>
                                </form>
                                <form action='activate_student.php' method='post' style='display:inline;'>
                                    <input type='hidden' name='id' value='{$row['id']}'>
                                    <button type='submit' name='action' value='reject' class='btn btn-danger btn-sm'>Reject</button>
                                </form>
                            </td>
                        </tr>";
                    }
                } else {
                    echo "<tr><td colspan='4'>No unapproved students found.</td></tr>";
                }

                $conn->close();
                ?>
            </tbody>
        </table>
    </div>

    <div id="reader" style="width: 100%; height: 100vh;"></div>
    

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://unpkg.com/html5-qrcode/minified/html5-qrcode.min.js"></script>
    <script src="admin.js"></script>
</body>
</html>
