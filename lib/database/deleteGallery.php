<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");
if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
}
$galleryId = $_POST['galleryId'];

$sql = "DELETE FROM galleries WHERE galleryId='$galleryId'";

$result = $conn->query($sql);
$conn->close();
?>