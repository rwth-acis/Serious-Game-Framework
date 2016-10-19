<?php
include 'config.php';

$gameId = $_POST['gameId'];
$highscoreId = $_POST['highScoreId'];
$gameCompletionBadgeSrc = $_POST['gameCompletionBadgeSrc'];

$result = $conn->query("UPDATE game_rules SET gameId='$gameId', highscoreId='$highscoreId', gameCompletionBadgeSrc='$gameCompletionBadgeSrc' WHERE gameId='$gameId'");
$conn->close();
?>