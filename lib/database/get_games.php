<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT gameId,gameName,gameCategory,gameDescription,gameDescriptionText, gameDesignerName, gameDesignerInstitution, gameDesignerEmail,gallery1Id,gallery2Id,gallery3Id,gallery4Id,connection1Id,connection2Id,connection3Id,oidcEmail FROM game_galleries_connections WHERE deleted='false'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>