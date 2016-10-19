<?php
include 'config.php';
$myArray = [];
$defaultHighscore = 1;

$gameId = "";
$gameName = "";
$gameDescription = "";
$oidcEmail = "";


if($result = $conn->query("SELECT gameId,gameName,gameDescription,oidcEmail FROM game_galleries_connections WHERE deleted='false'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {

		$gameId = $row["gameId"];
		$gameName = $row["gameName"];
		$gameDescription = $row["gameDescription"];
		$oidcEmail = $row["oidcEmail"];

		if($result1 = $conn->query("SELECT highscoreId FROM game_rules WHERE gameId='$gameId'")){

			if(!($row = $result1->fetch_array(MYSQL_ASSOC))) {
				$sql = "INSERT INTO game_rules (gameId, gameName, gameDescription, highscoreId, oidcEmail) VALUES ";

				$sql .= "(".$gameId.", '".$gameName."', '".$gameDescription."', ".$defaultHighscore.", '".$oidcEmail."')";		
				$result2 = $conn->query($sql);
			}
		}

	}
}

$conn->close();
?>