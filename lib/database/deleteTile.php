<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");
if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
}
$galleryId = $_POST['galleryId'];
$tileSrc = $_POST['tileSrc'];

$sql = "DELETE FROM gallery_tiles WHERE galleryId='$galleryId' AND tileSrc='$tileSrc'";

$result = $conn->query($sql);
$conn->close();
?>