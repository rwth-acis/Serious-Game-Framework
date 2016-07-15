<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");
if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
}

$badgeSrc = $_POST['badgeSrc'];

$sql = "DELETE FROM badges WHERE badgeSrc='$badgeSrc'";

$result = $conn->query($sql);
$conn->close();
?>