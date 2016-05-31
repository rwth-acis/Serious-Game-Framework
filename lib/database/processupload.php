<?php
  if (isset($_POST['test1'])) {
	if ($_FILES["FileInput"]["error"] > 0) {
		echo "Error: " . $_FILES["FileInput"]["error"] . "<br />";
	}  else {
        echo "Upload: " . $_FILES["FileInput"]["name"] . "<br />";
        echo "Type: " . $_FILES["FileInput"]["type"] . "<br />";
        echo "Size: " . ($_FILES["FileInput"]["size"] / 1024) . " Kb<br />";
        echo "Stored in: " . $_FILES["FileInput"]["tmp_name"];
		move_uploaded_file($_FILES["FileInput"]["tmp_name"], "tmp/" . $_FILES["FileInput"]["name"]);
	}
  }
?>