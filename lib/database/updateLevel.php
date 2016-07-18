<?php
include 'config.php';

$id = $_POST['id'];
$eLearningLink = $_POST['eLearningLink'];
$result = $conn->query("UPDATE levels SET eLearningLink='$eLearningLink' WHERE id='$id'");
$conn->close();
?>