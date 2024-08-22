<?php
session_start();
include 'db.php';

header('Content-Type: application/json');

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['id'], $data['type'], $data['name'], $data['amount'])) {
    $id = intval($data['id']);
    $type = intval($data['type']);
    $name = $conn->real_escape_string($data['name']);
    $amount = floatval($data['amount']);

    // Prepare SQL query to update the expense
    $sql = "UPDATE expenses SET type = ?, name = ?, amount = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isdi", $type, $name, $amount, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update the expense.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid input.']);
}

$conn->close();
?>
