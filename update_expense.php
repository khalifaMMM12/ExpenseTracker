<?php
include 'db.php';

$id = $_POST['id'];
$type = $_POST['type'];
$name = $_POST['name'];
$amount = $_POST['amount'];

$sql = "UPDATE expenses SET type = ?, name = ?, amount = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isdi", $type, $name, $amount, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
