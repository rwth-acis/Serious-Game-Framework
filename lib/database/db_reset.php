<?php
// Connect to database
$link = mysql_connect("tosini.informatik.rwth-aachen.de", "", "")
    or die("No connection to database.");
	
echo "Verbindung zum Datenbankserver erfolgreich. <br />";

$dbselect = mysql_select_db("_");

if (!$dbselect) {
	// database does not exist
    $query="CREATE DATABASE _ CHARACTER SET utf8 COLLATE utf8_unicode_ci";
	mysql_query($query);
    mysql_select_db('_');
	echo "database _ created";
}

$query = "SHOW TABLES FROM _";
$result = mysql_query($query);
if (!$result) {
    echo "DB Fehler, konnte Tabellen nicht auflisten\n";
    echo 'MySQL Fehler: ' . mysql_error();
    exit;
}

while ($row = mysql_fetch_row($result)) {
    echo "Tabelle: {$row[0]}  <br />";
}

mysql_free_result($result);

//$num_rows = mysql_num_rows($result);
//if ($num_rows < 1) {
//	
//}

//$query="CREATE TABLE IF NOT EXISTS connections(
//		id int(11) NOT NULL AUTO_INCREMENT,
//		description varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
//		setId int(11) NOT NULL,
//		src varchar(255) COLLATE utf8_unicode_ci NOT NULL,
//		PRIMARY KEY (id)
//	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
//mysql_query($query);
//
//$query="CREATE TABLE IF NOT EXISTS pieces(
//		id int(11) NOT NULL AUTO_INCREMENT,
//		description varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL,
//		setId int(11) NOT NULL,
//		src varchar(255) COLLATE utf8_unicode_ci NOT NULL,
//		PRIMARY KEY (id)
//	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
//mysql_query($query);
//
//
//// Add some data in the tables:
//
//$result = mysql_query("SELECT * FROM connections", $link);
//$num_rows = mysql_num_rows($result);
//if (!$num_rows) {
//	$query = "INSERT INTO connections (id, description, setId, src) VALUES
//		(1, 'Arrow right blue', 0, '1374080611_arrow.png'),
//		(2, 'Arrow right green', 0, '1374080684_arrow_right.png')";
//	mysql_query($query);
//}
//
//$result = mysql_query("SELECT * FROM pieces", $link);
//$num_rows = mysql_num_rows($result);
//if (!$num_rows) {
//	$query = "INSERT INTO `pieces` (`id`, `description`, `setId`, `src`) VALUES
//		(1, 'Test', 0, 'HHO1_1.jpg'),
//		(2, NULL, 0, 'HHO1_2.jpg'),
//		(3, '', 0, 'HHO1_3.jpg'),
//		(4, '', 0, 'HHO1_4.jpg'),
//		(5, '', 0, 'HHO1_5.jpg'),
//		(6, '', 0, 'HHO1_6.jpg'),
//		(7, '', 0, 'HHO1_7.jpg'),
//		(8, '', 0, 'HHO1_8.jpg'),
//		(9, '', 0, 'HHO1_9.jpg'),
//		(10, '', 0, 'HHO1_10.jpg')";
//	mysql_query($query);
//}


?>