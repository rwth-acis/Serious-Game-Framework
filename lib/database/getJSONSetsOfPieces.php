<?php
// Connect to database
$link = mysqli_connect("tosini.informatik.rwth-aachen.de", "", "", "")
	or die("No connection to database.");

$return_arr = Array();
$result = mysqli_query($link, "SELECT * FROM setsOfPieces");
while ($row = mysqli_fetch_object($result)) {
	array_push($return_arr,$row);
}

echo json_encode($return_arr);

?>