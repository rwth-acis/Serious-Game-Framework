<?php
include 'config.php';
$myArray = [];
if($result = $conn->query("SELECT highscoreId,correct,wrong, showMe, tryAgain,hint,oidcEmail,dateOfEntry FROM highscore_rules WHERE deleted='false'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$conn->close();
?>