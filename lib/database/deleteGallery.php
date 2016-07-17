<?php
include 'config.php';
$galleryId = $_POST['galleryId'];

$sql = "DELETE FROM galleries WHERE galleryId='$galleryId'";

$result = $conn->query($sql);
$conn->close();
?>