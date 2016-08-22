<?php
include 'config.php';

$id = $_POST['id'];
$eLearningLink = $_POST['eLearningLink'];
$moreInformation = $_POST['moreInformation'];
$result = $conn->query("UPDATE levels SET eLearningLink='$eLearningLink', moreInformation='$moreInformation' WHERE id='$id'");
$conn->close();
?>