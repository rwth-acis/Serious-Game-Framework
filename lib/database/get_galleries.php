<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT galleryId,galleryName,galleryDescription,oidcEmail FROM galleries WHERE deleted='false'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>