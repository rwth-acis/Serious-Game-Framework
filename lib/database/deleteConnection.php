<?php
include 'config.php';
$connectionSrc = $_POST['connectionSrc'];

$sql = "DELETE FROM connections WHERE connectionSrc='$connectionSrc'";

$result = $conn->query($sql);
$conn->close();
?>