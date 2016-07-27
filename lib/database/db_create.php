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
		moreInformation varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
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
		gameCategory varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gameDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gameDescriptionText varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gameDesignerName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gameDesignerInstitution varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		gameDesignerEmail varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
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

$query="CREATE TABLE IF NOT EXISTS experience_badges(
		badgeId int(11) NOT NULL AUTO_INCREMENT,
		badgeName varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeDescription varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		badgeFeedbackMessage varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		score int(11) NOT NULL,
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
		requirementValue int(11) NOT NULL,
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

$query="CREATE TABLE IF NOT EXISTS highscore_rules(
		id int(11) NOT NULL AUTO_INCREMENT,
		highscoreId int(11) NOT NULL,
		correct int(11) NOT NULL,
		wrong int(11) NOT NULL,
		showMe int(11) NOT NULL,
		tryAgain int(11) NOT NULL,
		hint int(11) NOT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$query="CREATE TABLE IF NOT EXISTS game_rules(
		id int(11) NOT NULL AUTO_INCREMENT,
		gameId int(11) NOT NULL,
		highscoreId int(11) NOT NULL,
		gameCompletionBadgeSrc varchar(255) COLLATE utf8_unicode_ci NULL DEFAULT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0";
$result = $conn->query($query);

$conn->close();
?>