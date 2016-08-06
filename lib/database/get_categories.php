<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT DISTINCT gameCategory FROM game_galleries_connections")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>