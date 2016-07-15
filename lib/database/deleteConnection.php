<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");
if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
}
$connectionSrc = $_POST['connectionSrc'];

$sql = "DELETE FROM connections WHERE connectionSrc='$connectionSrc'";

$result = $conn->query($sql);
$conn->close();
?>