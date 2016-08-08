<?php
include 'config.php';

$galleryId = $_POST['galleryId'];
$deleted = $_POST['deleted'];

$result = $conn->query("UPDATE galleries SET deleted='$deleted' WHERE galleryId='$galleryId'");
$conn->close();
?>