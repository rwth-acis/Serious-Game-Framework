<?php
include 'config.php';

$highscoreId = $_POST['highscoreId'];
$correct = $_POST['correct'];
$wrong = $_POST['wrong'];
$showMe = $_POST['showMe'];
$tryAgain = $_POST['tryAgain'];
$hint = $_POST['hint'];

$result = $conn->query("UPDATE highscore_rules SET correct='$correct',wrong='$wrong', showMe='$showMe',tryAgain='$tryAgain', hint='$hint' WHERE highscoreId='$highscoreId'");
$conn->close();
?>