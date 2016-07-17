<?php
include 'config.php';
if($result = $conn->query("SELECT gameId,gameName,gameDescription,gallery1Id,gallery2Id,gallery3Id,gallery4Id,connection1Id FROM game_galleries_connections")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>