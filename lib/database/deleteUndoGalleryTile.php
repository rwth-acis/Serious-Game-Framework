<?php
include 'config.php';

$tileSrc = $_POST['tileSrc'];
$deleted = $_POST['deleted'];

$result = $conn->query("UPDATE gallery_tiles SET deleted='$deleted' WHERE tileSrc='$tileSrc'");
$conn->close();
?>