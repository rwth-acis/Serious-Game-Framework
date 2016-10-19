<?php
include 'config.php';

$badgeSrc = $_POST['badgeSrc'];
$badgeName = $_POST['badgeName'];
$badgeDescription = $_POST['badgeDescription'];
$badgeFeedbackMessage = $_POST['badgeFeedbackMessage'];
$score = $_POST['score'];

$result = $conn->query("UPDATE experience_badges SET badgeName='$badgeName', badgeDescription='$badgeDescription', badgeFeedbackMessage='$badgeFeedbackMessage', score='$score' WHERE badgeSrc='$badgeSrc'");
$conn->close();
?>