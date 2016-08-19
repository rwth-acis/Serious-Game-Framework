<?php
include 'config.php';
$sql = "INSERT INTO game_statistics_badges (badgeName,badgeDescription,badgeFeedbackMessage,badgeRequirementId,requirementValue,oidcEmail,badgeSrc) VALUES ";
$allowed = array('png', 'jpg', 'gif');

$badgeName = $_POST['badgeName'];
$badgeDescription = $_POST['badgeDescription'];
$badgeFeedbackMessage = $_POST['badgeFeedbackMessage'];
$badgeRequirementId = $_POST['badgeRequirementId'];
$requirementValue = $_POST['requirementValue'];
$oidcEmail = $_POST['oidcEmail'];


	if ($_FILES['uploadGameBadge']['error'] == 4) {
	        continue; // Skip file if any error found
	    }	
	    if($_FILES['uploadGameBadge']['error'] == 0){

	    	//echo '{"status":"no error till now"}';


	    	$extension = pathinfo($_FILES['uploadGameBadge']['name'], PATHINFO_EXTENSION);

	    	//echo $extension;
	    	if(!in_array(strtolower($extension), $allowed)){
	    		//echo '{"status":"file type not allowed"}';
	    		exit;
	    	}
	    	$filename = $conn->real_escape_string($_FILES["uploadGameBadge"]["name"]);
	    	$filename = uniqid().'_'.$filename;
	    	$newfilename = $path.$filename;
	    	$fileNames[] = $filename;
	    	if(move_uploaded_file($_FILES['uploadGameBadge']['tmp_name'], $newfilename)){
	    		
	    		$sql .= "('".$badgeName."', '".$badgeDescription."', '".$badgeFeedbackMessage."', ".$badgeRequirementId.", ".$requirementValue.", '".$oidcEmail."', '".$filename."')";
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