<?php
include 'config.php';
$gameId = $_POST['gameId'];
$connection3Id = $_POST['connectionSrc3'];
$result = $conn->query("UPDATE game_galleries_connections SET connection3Id='$connection3Id' WHERE gameId='$gameId'");
$conn->close();
?>