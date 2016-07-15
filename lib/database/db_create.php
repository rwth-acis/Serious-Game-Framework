<?php
$conn = new mysqli("localhost:3308", "root", "root","sgf");

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}
$query="CREATE TABLE IF NOT EXISTS levels(
		id int(11) NOT NULL AUTO_INCREMENT,
		gameId int(11) NOT NULL,
		gallery1src varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gallery2src varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gallery3src varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gallery4src varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		eLearningLink varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);
//echo "query executed";
$query="CREATE TABLE IF NOT EXISTS galleries(
		id int(11) NOT NULL AUTO_INCREMENT,
		galleryId int(11) NOT NULL,
		galleryName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		galleryDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS gallery_tiles(
		id int(11) NOT NULL AUTO_INCREMENT,
		galleryId int(11) NOT NULL,
		tileName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		tileSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);
//echo "table galleries created";
$query="CREATE TABLE IF NOT EXISTS game_galleries_connections(
		gameId int(11) NOT NULL AUTO_INCREMENT,
		gameName varchar(255) COLLATE utf8_unicode_ci NOT NULL,
		gameDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gallery1Id varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gallery2Id varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gallery3Id varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gallery4Id varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		connection1Id varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		connection2Id varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		connection3Id varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (gameId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS connections(
		connectionId int(11) NOT NULL AUTO_INCREMENT,
		connectionName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		connectionSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (connectionId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS badges(
		badgeId int(11) NOT NULL AUTO_INCREMENT,
		badgeName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (badgeId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);
$conn->close();
?>