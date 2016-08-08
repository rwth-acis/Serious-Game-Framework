<?php
include 'config.php';

$galleryId = "";

if($result = $conn->query("SELECT galleryId FROM galleries WHERE deleted='true'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
		$galleryId = $row["galleryId"];

		$sql1 = "DELETE FROM galleries WHERE galleryId='$galleryId'";

		$result1 = $conn->query($sql1);

		if($result2 = $conn->query("SELECT tileSrc FROM gallery_tiles WHERE galleryId='$galleryId'")){

			while($row = $result2->fetch_array(MYSQL_ASSOC)) {
				$filename = $path.$row["tileSrc"];
				if(!unlink($filename)){
					echo "Error deleting ".$filename;
				}
			}
		}

		$sql2 = "DELETE FROM gallery_tiles WHERE galleryId='$galleryId'";

		$result = $conn->query($sql2);

	}
}

if($result = $conn->query("SELECT connectionSrc FROM connections WHERE deleted='true'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
		$filename = $path.$row["connectionSrc"];
			if(!unlink($filename)){
				echo "Error deleting ".$filename;
			}
	}

}
$sql = "DELETE FROM connections WHERE deleted='true'";

$result = $conn->query($sql);

$sql = "DELETE FROM levels WHERE deleted='true'";

$result = $conn->query($sql);

$gameId = "";

if($result = $conn->query("SELECT gameId FROM game_galleries_connections WHERE deleted='true'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {

		$gameId = $row["gameId"];

		$sql1 = "DELETE FROM game_galleries_connections WHERE gameId='$gameId'";

		$result1 = $conn->query($sql1);

		$sql2 = "DELETE FROM levels WHERE gameId='$gameId'";

		$result = $conn->query($sql2);

	}
}
		
$conn->close();
?>