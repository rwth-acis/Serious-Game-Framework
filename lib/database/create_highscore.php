<?php
include 'config.php';

$sql = "INSERT INTO highscore_rules (correct, wrong, showMe,tryAgain,hint, oidcEmail ) VALUES ";

$correct = $_POST['correct'];
$wrong = $_POST['wrong'];
$showMe = $_POST['showMe'];
$tryAgain = $_POST['tryAgain'];
$hint = $_POST['hint'];
$oidcEmail = $_POST['oidcEmail'];

$sql .= "(".$correct.", ".$wrong.",".$showMe.", ".$tryAgain.",".$hint.", '".$oidcEmail."')";
$result = $conn->query($sql);
$conn->close();
?>