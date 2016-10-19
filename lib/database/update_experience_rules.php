<?php
include 'config.php';

$ruleId = $_POST['ruleId'];
$highscoreFactor = $_POST['highscoreFactor'];
$eLearningLinkFactor = $_POST['eLearningLinkFactor'];
$moreInformationLinkFactor = $_POST['moreInformationLinkFactor'];
$badgeFactor = $_POST['badgeFactor'];
$gamesDesignedFactor = $_POST['gamesDesignedFactor'];
$loginFactor = $_POST['loginFactor'];
$oidcEmail = $_POST['oidcEmail'];

$result = $conn->query("UPDATE experience_rules_fixed SET highscoreFactor='$highscoreFactor', eLearningLinkFactor='$eLearningLinkFactor', moreInformationLinkFactor='$moreInformationLinkFactor', badgeFactor='$badgeFactor', gamesDesignedFactor='$gamesDesignedFactor', loginFactor='$loginFactor', oidcEmail='$oidcEmail' WHERE ruleId='$ruleId'");
$conn->close();
?>