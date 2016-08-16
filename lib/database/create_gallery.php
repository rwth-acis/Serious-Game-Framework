<?php
include 'config.php';

$sql = "INSERT INTO galleries (galleryName, galleryDescription, oidcEmail ) VALUES ";

$galleryName = $_POST['galleryName'];
$galleryDescription = $_POST['galleryDescription'];
$oidcEmail = $_POST['oidcEmail'];

$sql .= "('".$galleryName."', '".$galleryDescription."', '".$oidcEmail."')";
$result = $conn->query($sql);

$conn->close();
?>