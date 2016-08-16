<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT ruleId,highscoreFactor,eLearningLinkFactor,moreInformationLinkFactor,badgeFactor,gamesDesignedFactor,loginFactor,oidcEmail FROM experience_rules_fixed")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }

    echo json_encode($myArray);
}
$conn->close();
?>