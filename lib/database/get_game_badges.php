<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT badgeId,badgeName,badgeDescription,badgeSrc,badgeFeedbackMessage,badgeRequirementId,requirementValue,oidcEmail FROM game_statistics_badges WHERE deleted='false'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }

    echo json_encode($myArray);
}
$conn->close();
?>