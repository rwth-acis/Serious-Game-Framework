<?php
include 'config.php';

$highscoreId = $_POST['highscoreId'];
$deleted = $_POST['deleted'];

$result = $conn->query("UPDATE highscore_rules SET deleted='$deleted' WHERE highscoreId='$highscoreId'");
$conn->close();
?>