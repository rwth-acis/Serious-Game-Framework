<?php
include 'config.php';

$badgeSrc = $_POST['badgeSrc'];
$badgeName = $_POST['badgeName'];
$badgeDescription = $_POST['badgeDescription'];
$badgeFeedbackMessage = $_POST['badgeFeedbackMessage'];
$badgeRequirementId = $_POST['badgeRequirementId'];
$requirementValue = $_POST['requirementValue'];

$result = $conn->query("UPDATE game_statistics_badges SET badgeName='$badgeName', badgeDescription='$badgeDescription', badgeFeedbackMessage='$badgeFeedbackMessage', badgeRequirementId='$badgeRequirementId', requirementValue='$requirementValue' WHERE badgeSrc='$badgeSrc'");
$conn->close();
?>