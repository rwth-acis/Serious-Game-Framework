<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT connectionSrc,oidcEmail FROM connections WHERE deleted='false'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>