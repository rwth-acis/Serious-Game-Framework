var GLEANER_URL = "http://localhost:3000/";
var oidc_userinfo = {name: "Marko Kajzer", preferred_username: "marko.kajzer", email: "marko.kajzer@hotmail.de"};

var GAMESDATA;
var GALLERYNAMES;
var HIGHSCORE_VERSIONS;
var GAME_BADGES;
var GAME_RULES_DATA;
var EXPERIENCE_BADGES;
var EXPERIENCE_RULES;
var TILES_CONNECTIONS_PATH = "tiles_connections/";
var EXPERIENCE_BADGES_PATH = "experience_badges/";
var GAME_BADGES_PATH = "game_badges/";
//var GAMELEVELS;
$(document).ready(function() {



	
		$.ajax({
		url: "lib/database/db_create.php",
		type: "GET",
		contentType: false,
		success: function(data){
					//alert(data);
				}
			});

		$.ajax({
		url: "lib/database/create_default_highscore.php",
		type: "GET",
		contentType: false,
		success: function(data){
					//alert(data);
				}
			});

	function deleteOldData(){
	$.ajax({
		url: "lib/database/deleteOldData.php",
		type: "GET",
		contentType: false,
		success: function(data){
			getGamesList();	
			getGalleriesList();
			getHighscoreVersions();
			getGameBadges();
			getGameRules();
			getExperienceRules();
			getExperienceBadges();
		}
	});
}
	function getGamesList(){
		$.ajax({
			url: "lib/database/get_games.php",
			type: "GET",
			contentType: false,
			success: function(data){
					//alert(data);
					GAMESDATA = JSON.parse(data);
					//fillGamesList(GAMESDATA);
				}
			});
	}

	function getGalleriesList(){
		$.ajax({
			url: "lib/database/get_galleries.php",
			type: "GET",
			contentType: false,
			success: function(data){
					//alert(data);
					GALLERYNAMES = JSON.parse(data);
					
				}
			});
	}	

	function getHighscoreVersions(){
		$.ajax({
			url: "lib/database/get_highscore_versions.php",
			type: "GET",
			contentType: false,
			success: function(data){
					//alert(data);
					HIGHSCORE_VERSIONS = JSON.parse(data);

				}
			});
	}

	function getGameBadges(){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		if(formdata){
			$.ajax({
				url: "lib/database/get_game_badges.php",
				type: "GET",
				contentType: false,
				success: function(data){
					GAME_BADGES = JSON.parse(data);
				}
			});
		}
	}

	function getExperienceBadges(){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		if(formdata){
			$.ajax({
				url: "lib/database/get_experience_badges.php",
				type: "GET",
				contentType: false,
				success: function(data){
					EXPERIENCE_BADGES = JSON.parse(data);
				}
			});
		}
	}

	function getExperienceRules(){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		if(formdata){
			$.ajax({
				url: "lib/database/get_experience_rules.php",
				type: "GET",
				contentType: false,
				success: function(data){
					EXPERIENCE_RULES = JSON.parse(data);
				}
			});
		}
	}

	function getGameRules(){
		$.ajax({
			url: "lib/database/get_game_rules.php",
			type: "GET",
			contentType: false,
			success: function(data){
					//alert(data);
					GAME_RULES_DATA = JSON.parse(data);
					//fillGamesList(GAMESDATA);
				}
			});
	}

	deleteOldData();

});	