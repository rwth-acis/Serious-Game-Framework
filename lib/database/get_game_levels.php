<?php
include 'config.php';
$gameId = $_POST['gameId'];
if($result = $conn->query("SELECT gallery1src, gallery2src, gallery3src, gallery4src, eLearningLink FROM levels WHERE gameId='$gameId'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>