<?php
session_start();
include 'db.php';

// Decode the JSON data from the request body
$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];

// Prepare the SQL statement with a placeholder
$sql = $conn->prepare("DELETE FROM expenses WHERE id = ?");
$sql->bind_param("i", $id); // "i" indicates the type is an integer

// Execute the prepared statement and check the result
if ($sql->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $sql->error]);
}

// Close the statement and connection
$sql->close();
$conn->close();
?>
