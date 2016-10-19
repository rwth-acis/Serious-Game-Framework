<?php
include 'config.php';

$sql = "INSERT INTO game_designers (oidcEmail, admin ) VALUES ";

$admin = $_POST['admin'];
$oidcEmail = $_POST['oidcEmail'];

$sql .= "('".$oidcEmail."', '".$admin."')";
$result = $conn->query($sql);

$conn->close();
?>