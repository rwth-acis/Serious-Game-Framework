<?php
include 'config.php';
$sql = "INSERT INTO connections (connectionName,connectionSrc) VALUES ";
$allowed = array('png', 'jpg', 'gif');
$length = count($_FILES['uploadConnections']['name']);

for ($i=0; $i<$length; $i++) { 
	if ($_FILES['uploadConnections']['error'][$i] == 4) {
	        continue; // Skip file if any error found
	    }	
	    if($_FILES['uploadConnections']['error'][$i] == 0){

	    	//echo '{"status":"no error till now"}';


	    	$extension = pathinfo($_FILES['uploadConnections']['name'][$i], PATHINFO_EXTENSION);

	    	//echo $extension;
	    	if(!in_array(strtolower($extension), $allowed)){
	    		//echo '{"status":"file type not allowed"}';
	    		exit;
	    	}
	    	$tilename = $conn->real_escape_string($_FILES["uploadConnections"]["name"][$i]);
	    	$filename = uniqid().$i.'_'.$tilename;
	    	$newfilename = $path.$filename;
	    	$fileNames[] = $filename;
	    	if(move_uploaded_file($_FILES['uploadConnections']['tmp_name'][$i], $newfilename)){
	    		if ($i > 0)
	    		{
	    			$sql .= "; ";
	    			$sql .= "INSERT INTO connections (connectionName, connectionSrc) VALUES ";
	    		}
	    		$sql .= "('".$tilename."', '".$filename."')";
	    	}
	    }
	    if($i == $length - 1){
	    	//echo '{"status":"images saved successfully!"}';
	    	//echo "query is".$sql;
	    	if ($conn->multi_query($sql) === TRUE) {
	    		//echo "New records created successfully";
	    		echo json_encode($fileNames);
	    	} else {
	    		//echo "Error: " . $sql . "<br>" . $conn->error;
	    	}
	    	exit;
	    }
	}

	$conn->close();
	?>