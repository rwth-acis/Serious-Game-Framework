<?php
include 'config.php';

$sql = "INSERT INTO highscore_rules (correct, wrong, showMe,tryAgain,hint, oidcEmail ) VALUES ";

$correct = $_POST['correct'];
$wrong = $_POST['wrong'];
$showMe = $_POST['showMe'];
$tryAgain = $_POST['tryAgain'];
$hint = $_POST['hint'];
$oidcEmail = $_POST['oidcEmail'];

$sql .= "(".$correct.", ".$wrong.",".$showMe.", ".$tryAgain.",".$hint.", '".$oidcEmail."')";
$result = $conn->query($sql);


$max = 0;
if($result = $conn->query("SELECT highscoreId FROM highscore_rules ORDER BY highscoreId DESC LIMIT 1")){

	/*while($row = $result->fetch_array(MYSQL_ASSOC)) {
		$myArray[] = $row;
	}*/
	if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
       
        $max = $row["highscoreId"];
    }
    echo $max;
} 
}


$conn->close();
?>