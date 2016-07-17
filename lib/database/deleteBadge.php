<?php
include 'config.php';
$badgeSrc = $_POST['badgeSrc'];

$sql = "DELETE FROM badges WHERE badgeSrc='$badgeSrc'";

$result = $conn->query($sql);
$conn->close();
?>