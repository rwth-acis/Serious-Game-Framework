<?php
include 'config.php';
$galleryId = $_POST['galleryId'];

$sql = "DELETE FROM galleries WHERE galleryId='$galleryId'";

$result = $conn->query($sql);


if($result = $conn->query("SELECT tileSrc FROM gallery_tiles WHERE galleryId='$galleryId'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $filename = $path.$row["tileSrc"];
            if(!unlink($filename)){
            	echo "Error deleting ".$filename;
            }
    }
}

$sql = "DELETE FROM gallery_tiles WHERE galleryId='$galleryId'";

$result = $conn->query($sql);

mysqli_rollback($con);
$conn->close();
?>