<?php
include 'config.php';

$id = $_POST['id'];
$sql = "DELETE FROM levels WHERE id='$id'";

$result = $conn->query($sql);
$conn->close();
?>