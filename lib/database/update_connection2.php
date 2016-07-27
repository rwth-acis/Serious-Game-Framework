<?php
include 'config.php';
$gameId = $_POST['gameId'];
$connection2Id = $_POST['connectionSrc2'];
$result = $conn->query("UPDATE game_galleries_connections SET connection2Id='$connection2Id' WHERE gameId='$gameId'");
$conn->close();
?>