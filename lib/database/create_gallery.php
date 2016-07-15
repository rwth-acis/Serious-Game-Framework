<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");
if (mysqli_connect_errno()) {
	printf("Connect failed: %s\n", mysqli_connect_error());
	exit();
}
$max = 0;
if($result = $conn->query("SELECT galleryId FROM galleries ORDER BY galleryId DESC LIMIT 1")){

	/*while($row = $result->fetch_array(MYSQL_ASSOC)) {
		$myArray[] = $row;
	}*/
	if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        echo "id: " . $row["galleryId"];
        $max = $row["galleryId"];
    }
} else {
    echo "0 results";
}
	if($max == NULL) $max = 0;
}
$max = $max + 1;
echo "max is ".$max;

$sql = "INSERT INTO galleries (galleryId, galleryName, galleryDescription) VALUES ";

$galleryName = $_POST['galleryName'];
$galleryDescription = $_POST['galleryDescription'];
echo 'gallery name is '.$galleryName;

$sql .= "(".$max.", '".$galleryName."', '".$galleryDescription."')";
$result = $conn->query($sql);
echo $max;
$result->close();
$conn->close();
?>