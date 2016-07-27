<?php
include 'config.php';
$gameId = $_POST['gameId'];
$connection1Id = $_POST['connectionSrc1'];
$result = $conn->query("UPDATE game_galleries_connections SET connection1Id='$connection1Id' WHERE gameId='$gameId'");
$conn->close();
?>