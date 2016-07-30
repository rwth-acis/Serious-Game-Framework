var GLEANER_URL = "http://localhost:3000/";

var GAMESDATA;
var GALLERYNAMES;
//var GAMELEVELS;
$(document).ready(function() {
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

/*function getGameLevels(gameId){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		
		formdata.append("gameId",gameId);
		$.ajax({
			url: "lib/database/get_game_levels.php",
			type: "POST",
			data: formdata,
			processData: false,
			contentType: false,
			success: function(data){
					//alert(data);
					GAMELEVELS = JSON.parse(data);
					//loadGaleries(GAMELEVELS);
				}
			});
	}*/

getGamesList();	
getGalleriesList();
//getGameLevels(2);

});	