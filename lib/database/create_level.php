<?php
include 'config.php';
$sql = "INSERT INTO levels (gameId, gallery1src, gallery2src, gallery3src, gallery4src, eLearningLink) VALUES ";

$gameId = $_POST['gameId'];
$gallery1src = $_POST['gallery1src'];
$gallery2src = $_POST['gallery2src'];
$gallery3src = $_POST['gallery3src'];
$gallery4src = $_POST['gallery4src'];
$eLearningLink = $_POST['eLearningLink'];
$sql .= "(".$gameId.", '".$gallery1src."', '".$gallery2src."', '".$gallery3src."', '".$gallery4src."', '".$eLearningLink."')";
$result = $conn->query($sql);
$conn->close();
?>