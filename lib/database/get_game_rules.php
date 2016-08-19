<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT gameId,gameName,gameDescription,highscoreId,gameCompletionBadgeSrc,oidcEmail FROM game_rules WHERE deleted='false'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>