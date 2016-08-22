<?php
include 'config.php';
$myArray = [];
$highscoreId = 1;
$gameId= "";
$arraySub = "";
if($result = $conn->query("SELECT gameId,highscoreId FROM game_rules")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
		$highscoreId = $row["highscoreId"];
		$gameId = $row["gameId"];

		if($result1 = $conn->query("SELECT correct,wrong, showMe, tryAgain,hint,oidcEmail FROM highscore_rules WHERE highscoreId='$highscoreId'")){

			if($row1 = $result1->fetch_array(MYSQL_ASSOC)) {
				$correct = $row1["correct"];
				$wrong = $row1["wrong"];
				$showMe = $row1["showMe"];
				$tryAgain = $row1["tryAgain"];
				$hint = $row1["hint"];
			}
			$arraySub = array('gameId' => $gameId, 'correct' => $correct, 'wrong' => $wrong, 'showMe' => $showMe, 'tryAgain' => $tryAgain, 'hint' => $hint);

		}
		$myArray[] =  $arraySub;
	}
	
	echo json_encode($myArray);
}
$conn->close();
?>