<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    exit();
}

$user_id = $_SESSION['user_id'];
$type = $_POST['type'];
$name = $_POST['name'];
$amount = $_POST['amount'];

$sql = "INSERT INTO entries (user_id, type, name, amount) VALUES ('$user_id', '$type', '$name', '$amount')";

$conn->query($sql);
$conn->close();
?>
