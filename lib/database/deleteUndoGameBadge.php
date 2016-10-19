<?php
include 'config.php';
$badgeSrc = $_POST['badgeSrc'];
$deleted = $_POST['deleted'];

$result = $conn->query("UPDATE game_statistics_badges SET deleted='$deleted' WHERE badgeSrc='$badgeSrc'");

$conn->close();
?>