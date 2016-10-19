<?php
include 'config.php';
$galleryId = $_POST['galleryId'];
$tileSrc = $_POST['tileSrc'];

$sql = "DELETE FROM gallery_tiles WHERE galleryId='$galleryId' AND tileSrc='$tileSrc'";

$result = $conn->query($sql);
$conn->close();
?>