<?php
include 'config.php';
$gameId = $_POST['gameId'];

$sql = "DELETE FROM game_galleries_connections WHERE gameId='$gameId'";

$result = $conn->query($sql);
$conn->close();
?>