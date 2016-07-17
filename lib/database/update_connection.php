<?php
include 'config.php';
$gameId = $_POST['gameId'];
$connection1Id = $_POST['connectionSrc'];
$result = $conn->query("UPDATE game_galleries_connections SET connection1Id='$connection1Id', connection2Id='$connection1Id', connection3Id='$connection1Id' WHERE gameId='$gameId'");
$conn->close();
?>