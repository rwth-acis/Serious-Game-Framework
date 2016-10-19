<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
$path = "../../tmp/";
?>