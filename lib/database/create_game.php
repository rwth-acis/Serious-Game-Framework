<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");
if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
}
$sql = "INSERT INTO game_galleries_connections (gameName, gameDescription, gallery1Id, gallery2Id, gallery3Id, gallery4Id, connection1Id, connection2Id, connection3Id) VALUES ";

$gameName = $_POST['gameName'];
$gameDescription = $_POST['gameDescription'];
$gallery1Id = $_POST['gallery1Id'];
$gallery2Id = $_POST['gallery2Id'];
$gallery3Id = $_POST['gallery3Id'];
$gallery4Id = $_POST['gallery4Id'];
$connection1Id = $_POST['connectionSrc'];
$sql .= "('".$gameName."', '".$gameDescription."', '".$gallery1Id."', '".$gallery2Id."', '".$gallery3Id."', '".$gallery4Id."', '".$connection1Id."', '".$connection1Id."', '".$connection1Id."')";
$result = $conn->query($sql);
$conn->close();
?>