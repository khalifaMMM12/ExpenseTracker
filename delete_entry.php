<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    exit();
}

$id = $_POST['id'];

$sql = "DELETE FROM entries WHERE id='$id'";
$conn->query($sql);
$conn->close();
?>
