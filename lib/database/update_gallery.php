<?php
include 'config.php';

$galleryName = $_POST['galleryName'];
$galleryDescription = $_POST['galleryDescription'];
$galleryId = $_POST['galleryId'];

$result = $conn->query("UPDATE galleries SET galleryName='$galleryName', galleryDescription='$galleryDescription' WHERE galleryId='$galleryId'");
$conn->close();
?>