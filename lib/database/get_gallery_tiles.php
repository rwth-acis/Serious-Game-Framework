<?php
include 'config.php';
$galleryId = $_POST['galleryId'];
if($result = $conn->query("SELECT tileSrc FROM gallery_tiles WHERE galleryId='$galleryId'")){

	while($row = $result->fetch_array(MYSQL_ASSOC)) {
            $myArray[] = $row;
    }
    /*$path = "../../tmp/";
    $file = $path.'people.txt';
// Open the file to get existing content
$current = file_get_contents($file);
echo $current;
// Append a new person to the file
$current .= json_encode($myArray);
// Write the contents back to the file
file_put_contents($file, $current);*/
    echo json_encode($myArray);
}
$conn->close();
?>