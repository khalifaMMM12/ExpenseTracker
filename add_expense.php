<?php
session_start();
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'];
$type = $data['type'];
$name = $data['name'];
$amount = $data['amount'];

$sql = "INSERT INTO expenses (user_id, type, name, amount) VALUES ('$user_id', '$type', '$name', '$amount')";
if ($conn->query($sql) === TRUE) {
    $last_id = $conn->insert_id;
    echo json_encode(['success' => true, 'id' => $last_id]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>
