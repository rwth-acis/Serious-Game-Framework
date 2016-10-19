<?php
include 'config.php';

$gameId = $_POST['gameId'];
$gameName = $_POST['gameName'];
$gameDescription = $_POST['gameDescription'];
$gameCategory = $_POST['gameCategory'];
$gameDescriptionText = $_POST['gameDescriptionText'];
$gameDesignerName = $_POST['gameDesignerName'];
$gameDesignerInstitution = $_POST['gameDesignerInstitution'];
$gameDesignerEmail = $_POST['gameDesignerEmail'];

$result = $conn->query("UPDATE game_galleries_connections SET gameName='$gameName', gameDescription='$gameDescription', gameCategory='$gameCategory', gameDescriptionText='$gameDescriptionText', gameDesignerName='$gameDesignerName', gameDesignerInstitution='$gameDesignerInstitution', gameDesignerEmail='$gameDesignerEmail' WHERE gameId='$gameId'");

$result = $conn->query("UPDATE game_rules SET gameName='$gameName', gameDescription='$gameDescription' WHERE gameId='$gameId'");

$conn->close();
?>