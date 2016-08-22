<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT badgeId,badgeName,badgeDescription,badgeSrc,badgeFeedbackMessage,score,oidcEmail FROM experience_badges WHERE deleted='false' ORDER BY score ASC")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }

    echo json_encode($myArray);
}
$conn->close();
?>