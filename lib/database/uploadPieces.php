<?php

$path = "tmp/";

// $_POST['select-setOfPieces-1'] refers to the selected set

// connect to db
$link = mysqli_connect("tosini.informatik.rwth-aachen.de", "", "", "");

// Check connection
if (mysqli_connect_errno())
{
	echo '{"status":"error"}';
	exit;
}

// A list of permitted file extensions
$allowed = array('png', 'jpg', 'gif');

if(isset($_FILES['FileInput-Pieces']) && $_FILES['FileInput-Pieces']['error'] == 0){

    $extension = pathinfo($_FILES['FileInput-Pieces']['name'], PATHINFO_EXTENSION);

    if(!in_array(strtolower($extension), $allowed)){
        echo '{"status":"error"}';
        exit;
    }
	
	$newfilename = $path . time() . "_" . $_FILES['FileInput-Pieces']['name'];
	
    if(move_uploaded_file($_FILES['FileInput-Pieces']['tmp_name'], $newfilename)){
		$query = "INSERT INTO pieces VALUES (NULL, '" . $_FILES['FileInput-Pieces']['name'] . "', '" . $_POST['select-setOfPieces-1'] . "', '" . $newfilename . "') ";
		$result = mysqli_query($link, $query) or die('{"status":"error"}');
        echo '{"status":"success"}';
        exit;
    }
}

echo '{"status":"error"}';
exit;
?>