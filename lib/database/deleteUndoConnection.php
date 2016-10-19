<?php
include 'config.php';
$connectionSrc = $_POST['connectionSrc'];
$deleted = $_POST['deleted'];

$result = $conn->query("UPDATE connections SET deleted='$deleted' WHERE connectionSrc='$connectionSrc'");

$conn->close();
?>