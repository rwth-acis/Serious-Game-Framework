<?php
include 'config.php';
if($result = $conn->query("SELECT galleryId,galleryName,galleryDescription FROM galleries")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>