<?php
include 'config.php';
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
if(!($result = $conn->query("SELECT moreInformation FROM levels"))){
	$query = "ALTER TABLE levels ADD moreInformation varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT dateOfEntry FROM levels"))){
	$query = "ALTER TABLE levels ADD dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT deleted FROM levels"))){
	$query = "ALTER TABLE levels ADD deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false'";
	$result = $conn->query($query);
}
//echo "query executed";
$query="CREATE TABLE IF NOT EXISTS galleries(
		id int(11) NOT NULL AUTO_INCREMENT,
		galleryId int(11) NOT NULL,
		galleryName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		galleryDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

if(!($result = $conn->query("SELECT oidcEmail FROM galleries"))){
	$query = "ALTER TABLE galleries ADD oidcEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT deleted FROM galleries"))){
	$query = "ALTER TABLE galleries ADD deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false'";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT dateOfEntry FROM galleries"))){
	$query = "ALTER TABLE galleries ADD dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP";
	$result = $conn->query($query);
}

$query="CREATE TABLE IF NOT EXISTS gallery_tiles(
		id int(11) NOT NULL AUTO_INCREMENT,
		galleryId int(11) NOT NULL,
		tileName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		tileSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

if(!($result = $conn->query("SELECT dateOfEntry FROM gallery_tiles"))){
	$query = "ALTER TABLE gallery_tiles ADD dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT deleted FROM gallery_tiles"))){
	$query = "ALTER TABLE gallery_tiles ADD deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false'";
	$result = $conn->query($query);
}
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

if(!($result = $conn->query("SELECT gameCategory FROM game_galleries_connections"))){
	$query = "ALTER TABLE game_galleries_connections ADD gameCategory varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}
if(!($result = $conn->query("SELECT gameDescriptionText FROM game_galleries_connections"))){
	$query = "ALTER TABLE game_galleries_connections ADD gameDescriptionText varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}

$query = "ALTER TABLE game_galleries_connections MODIFY COLUMN gameDescriptionText TEXT NULL DEFAULT NULL";
$result = $conn->query($query);

if(!($result = $conn->query("SELECT gameDesignerName FROM game_galleries_connections"))){
	$query = "ALTER TABLE game_galleries_connections ADD gameDesignerName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}
if(!($result = $conn->query("SELECT gameDesignerInstitution FROM game_galleries_connections"))){
	$query = "ALTER TABLE game_galleries_connections ADD gameDesignerInstitution varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}
if(!($result = $conn->query("SELECT gameDesignerEmail FROM game_galleries_connections"))){
	$query = "ALTER TABLE game_galleries_connections ADD gameDesignerEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}
if(!($result = $conn->query("SELECT oidcEmail FROM game_galleries_connections"))){
	$query = "ALTER TABLE game_galleries_connections ADD oidcEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT dateOfEntry FROM game_galleries_connections"))){
	$query = "ALTER TABLE game_galleries_connections ADD dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT deleted FROM game_galleries_connections"))){
	$query = "ALTER TABLE game_galleries_connections ADD deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false'";
	$result = $conn->query($query);
}

$query="CREATE TABLE IF NOT EXISTS connections(
		connectionId int(11) NOT NULL AUTO_INCREMENT,
		connectionName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		connectionSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (connectionId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

if(!($result = $conn->query("SELECT oidcEmail FROM connections"))){
	$query = "ALTER TABLE connections ADD oidcEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT dateOfEntry FROM connections"))){
	$query = "ALTER TABLE connections ADD dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP";
	$result = $conn->query($query);
}

if(!($result = $conn->query("SELECT deleted FROM connections"))){
	$query = "ALTER TABLE connections ADD deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false'";
	$result = $conn->query($query);
}

$query="CREATE TABLE IF NOT EXISTS badges(
		badgeId int(11) NOT NULL AUTO_INCREMENT,
		badgeName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (badgeId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS experience_badges(
		badgeId int(11) NOT NULL AUTO_INCREMENT,
		badgeName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeFeedbackMessage varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		score decimal(15,2) NOT NULL,
		oidcEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false',
		PRIMARY KEY (badgeId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS game_statistics_badges(
		badgeId int(11) NOT NULL AUTO_INCREMENT,
		badgeName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeFeedbackMessage varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeRequirementId int(11) NOT NULL,
		requirementValue decimal(15,2) NOT NULL,
		oidcEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false',
		PRIMARY KEY (badgeId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS badges_requirements(
		badgeRequirementId int(11) NOT NULL AUTO_INCREMENT,
		statisticName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		requirementDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (badgeRequirementId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS experience_rules(
		ruleId int(11) NOT NULL AUTO_INCREMENT,
		ruleName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		ruleValue int(11) NOT NULL,
		PRIMARY KEY (ruleId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS experience_rules_fixed(
		ruleId int(11) NOT NULL AUTO_INCREMENT,
		highscoreFactor decimal(15,2) NULL DEFAULT 1,
		eLearningLinkFactor decimal(15,2) NULL DEFAULT 3,
		moreInformationLinkFactor decimal(15,2) NULL DEFAULT 3,
		badgeFactor decimal(15,2) NULL DEFAULT 10,
		gamesDesignedFactor decimal(15,2) NULL DEFAULT 50,
		loginFactor decimal(15,2) NULL DEFAULT 0.5,
		oidcEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (ruleId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS highscore_rules(
		highscoreId int(11) NOT NULL AUTO_INCREMENT,
		correct decimal(15,2) NOT NULL DEFAULT 5,
		wrong decimal(15,2) NOT NULL DEFAULT 2,
		showMe decimal(15,2) NOT NULL DEFAULT 0,
		tryAgain decimal(15,2) NOT NULL DEFAULT 1,
		hint decimal(15,2) NOT NULL DEFAULT 0.5,
		oidcEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false',
		PRIMARY KEY (highscoreId)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS game_rules(
		id int(11) NOT NULL AUTO_INCREMENT,
		gameId int(11) NOT NULL,
		highscoreId int(11) NOT NULL,
		gameCompletionBadgeSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		oidcEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		dateOfEntry datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		deleted varchar(25) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'false',
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$conn->close();
?>