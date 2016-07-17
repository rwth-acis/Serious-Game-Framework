<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$gameId = $_POST['gameId'];
if($result = $conn->query("SELECT gallery1src, gallery2src, gallery3src, gallery4src, eLearningLink FROM levels WHERE gameId='$gameId'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>