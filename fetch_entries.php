<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit();
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT * FROM entries WHERE user_id='$user_id'";
$result = $conn->query($sql);

$entries = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $entries[] = $row;
    }
}

echo json_encode($entries);

$conn->close();
?>
