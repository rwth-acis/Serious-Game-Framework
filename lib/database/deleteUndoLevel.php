<?php
include 'config.php';

$id = $_POST['id'];
$deleted = $_POST['deleted'];

$result = $conn->query("UPDATE levels SET deleted='$deleted' WHERE id='$id'");

$conn->close();
?>