<?php
include 'config.php';
$sql = "INSERT INTO game_galleries_connections (gameName, gameDescription, gameDescriptionText, gameDesignerName, gameDesignerInstitution, gameDesignerEmail, gallery1Id, gallery2Id, gallery3Id, gallery4Id, connection1Id, connection2Id, connection3Id) VALUES ";

$gameName = $_POST['gameName'];
$gameDescription = $_POST['gameDescription'];
$gameDescriptionText = $_POST['gameDescriptionText'];
$gameDesignerName = $_POST['gameDesignerName'];
$gameDesignerInstitution = $_POST['gameDesignerInstitution'];
$gameDesignerEmail = $_POST['gameDesignerEmail'];
$gallery1Id = $_POST['gallery1Id'];
$gallery2Id = $_POST['gallery2Id'];
$gallery3Id = $_POST['gallery3Id'];
$gallery4Id = $_POST['gallery4Id'];
$connection1Id = $_POST['connectionSrc1'];
$connection2Id = $_POST['connectionSrc2'];
$connection3Id = $_POST['connectionSrc3'];
$sql .= "('".$gameName."', '".$gameDescription."', '".$gameDescriptionText."', '".$gameDesignerName."', '".$gameDesignerInstitution."', '".$gameDesignerEmail."', '".$gallery1Id."', '".$gallery2Id."', '".$gallery3Id."', '".$gallery4Id."', '".$connection1Id."', '".$connection2Id."', '".$connection3Id."')";
$result = $conn->query($sql);
$conn->close();
?>