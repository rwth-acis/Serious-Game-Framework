<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT badgeSrc FROM badges")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>