<?php
include 'config.php';
$sql = "INSERT INTO badges (badgeName, badgeDescription, badgeSrc) VALUES ";
$allowed = array('png', 'jpg', 'gif');

$badgeName = $_POST['badgeName'];
$badgeDescription = $_POST['badgeDescription'];

	if ($_FILES['uploadBadge']['error'] == 4) {
	        continue; // Skip file if any error found
	    }	
	    if($_FILES['uploadBadge']['error'] == 0){

	    	//echo '{"status":"no error till now"}';


	    	$extension = pathinfo($_FILES['uploadBadge']['name'], PATHINFO_EXTENSION);

	    	//echo $extension;
	    	if(!in_array(strtolower($extension), $allowed)){
	    		//echo '{"status":"file type not allowed"}';
	    		exit;
	    	}
	    	$filename = $conn->real_escape_string($_FILES["uploadBadge"]["name"]);
	    	$filename = uniqid().'_'.$filename;
	    	$newfilename = $path.$filename;
	    	$fileNames[] = $filename;
	    	if(move_uploaded_file($_FILES['uploadBadge']['tmp_name'], $newfilename)){
	    		
	    		$sql .= "('".$badgeName."', '".$badgeDescription."', '".$filename."')";
	    	}
	    }
	    
	    	//echo '{"status":"images saved successfully!"}';
	    	//echo "query is".$sql;
	    	if ($conn->multi_query($sql) === TRUE) {
	    		//echo "New records created successfully";
	    		echo json_encode($fileNames);
	    	} else {
	    		//echo "Error: " . $sql . "<br>" . $conn->error;
	    		exit;
	    	}
	    	
	    

	$conn->close();
	?>