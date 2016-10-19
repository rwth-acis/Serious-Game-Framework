<?php
include 'config.php';
$gameId = $_POST['gameId'];
$deleted = $_POST['deleted'];

$result = $conn->query("UPDATE game_galleries_connections SET deleted='$deleted' WHERE gameId='$gameId'");

$result = $conn->query("UPDATE game_rules SET deleted='$deleted' WHERE gameId='$gameId'");

$conn->close();
?>