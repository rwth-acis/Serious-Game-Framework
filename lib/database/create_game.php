<?php
include 'config.php';
$sql = "INSERT INTO game_galleries_connections (gameName, gameCategory, gameDescription, gameDescriptionText, gameDesignerName, gameDesignerInstitution, gameDesignerEmail, gallery1Id, gallery2Id, gallery3Id, gallery4Id, connection1Id, connection2Id, connection3Id, oidcEmail) VALUES ";

$gameName = $_POST['gameName'];
$gameDescription = $_POST['gameDescription'];
$gameDescriptionText = $_POST['gameDescriptionText'];
$gameDesignerName = $_POST['gameDesignerName'];
$gameDesignerInstitution = $_POST['gameDesignerInstitution'];
$gameDesignerEmail = $_POST['gameDesignerEmail'];
$gallery1Id = $_POST['gallery1Id'];
$gallery2Id = $_POST['gallery2Id'];
$gallery3Id = $_POST['gallery3Id'];
$gallery4Id = $_POST['gallery4Id'];
$connection1Id = $_POST['connectionSrc1'];
$connection2Id = $_POST['connectionSrc2'];
$connection3Id = $_POST['connectionSrc3'];
$gameCategory = $_POST['gameCategory'];
$oidcEmail = $_POST['oidcEmail'];
$sql .= "('".$gameName."', '".$gameCategory."', '".$gameDescription."', '".$gameDescriptionText."', '".$gameDesignerName."', '".$gameDesignerInstitution."', '".$gameDesignerEmail."', '".$gallery1Id."', '".$gallery2Id."', '".$gallery3Id."', '".$gallery4Id."', '".$connection1Id."', '".$connection2Id."', '".$connection3Id."', '".$oidcEmail."')";
$result = $conn->query($sql);


$max = 0;
if($result = $conn->query("SELECT gameId FROM game_galleries_connections ORDER BY gameId DESC LIMIT 1")){

	/*while($row = $result->fetch_array(MYSQL_ASSOC)) {
		$myArray[] = $row;
	}*/
	if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
       
        $max = $row["gameId"];
    }
    echo $max;
} else {
    echo "0 results";
}
	if($max == NULL) $max = 0;
}

$sql = "INSERT INTO game_rules (gameId, gameName, gameDescription, highscoreId, oidcEmail) VALUES ";

$highscoreId = 1;

$sql .= "(".$max.", '".$gameName."', '".$gameDescription."', ".$highscoreId.", '".$oidcEmail."')";
$result = $conn->query($sql);

$conn->close();
?>