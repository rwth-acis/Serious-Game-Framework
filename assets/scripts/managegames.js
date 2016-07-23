var UPLOADPATH = "uploads/";
var TEMP = "tmp/";

function rand(min, max) {
	if (!DEBUG) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
			// disable random value for debugging
			return min;
		}
	}

	$(document).ready(function() {

		$.ajax({
			url: "lib/database/db_create.php",
			type: "GET",
			contentType: false,
			success: function(data){
					//alert(data);
				}
			});

		setGalleryHeight();

		
		var CONNECTIONS2 = $("#populateconnections2"),
		CONNECTIONS2ul = $("ul", CONNECTIONS2);

		var GAMEGALLERY1 = $("#populategamegallery1"),
		GAMEGALLERY1ul = $("ul", GAMEGALLERY1);

		var GAMEGALLERY2 = $("#populategamegallery2"),
		GAMEGALLERY2ul = $("ul", GAMEGALLERY2);

		var GAMEGALLERY3 = $("#populategamegallery3"),
		GAMEGALLERY3ul = $("ul", GAMEGALLERY3);

		var GAMEGALLERY4 = $("#populategamegallery4"),
		GAMEGALLERY4ul = $("ul", GAMEGALLERY4);

		var CHANGECONNECTION = $("#populatechangeconnection"),
		CHANGECONNECTIONul = $("ul", CHANGECONNECTION);

		var GALLERYNAMES;
		var GAMEGALLERYNAMES;
		var GAMENAMES;
		var GAMELEVELS;
		var NUMBER_OF_GALLERIES;

		$('.select').find('option').css("height","20px"); 


		$('#button-right-populategamegallery1').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategamegallery1').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategamegallery1').stop();
			}
		});

		$('#button-left-populategamegallery1').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategamegallery1').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategamegallery1').stop();
			}
		});

		$('#button-right-populategamegallery2').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategamegallery2').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategamegallery2').stop();
			}
		});

		$('#button-left-populategamegallery2').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategamegallery2').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategamegallery2').stop();
			}
		});

		$('#button-right-populategamegallery3').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategamegallery3').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategamegallery3').stop();
			}
		});

		$('#button-left-populategamegallery3').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategamegallery3').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategamegallery3').stop();
			}
		});

		$('#button-right-populategamegallery4').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategamegallery4').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategamegallery4').stop();
			}
		});

		$('#button-left-populategamegallery4').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategamegallery4').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategamegallery4').stop();
			}
		});

		$('#button-right-populatechangeconnection').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populatechangeconnection').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populatechangeconnection').stop();
			}
		});

		$('#button-left-populatechangeconnection').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populatechangeconnection').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populatechangeconnection').stop();
			}
		});

		$(window).resize(function() {
			setGalleryHeight();
			setGalleryWidth();
		});

		
		$('#creategameslink').click(function() { 
			resetGameCreationView();
		});

		$('#editgameslink').click(function() { 
			resetEditGameView();
		});

		$('#gallerycount').change(function(){
			$('#create-game-message').text("");
			var galleryId = $('select[name=gallerycount]').val();
			if(galleryId < 2){
				$('#selectgallery1fieldset').addClass('hideElement');
				$('#selectgallery2fieldset').addClass('hideElement');
				$('#selectgallery3fieldset').addClass('hideElement');
				$('#selectgallery4fieldset').addClass('hideElement');
				$('#selectconnection-fieldset').addClass('hideElement');
				$('#create-game-button').find('*').prop('disabled',true);
				$('#create-game-button').find('*').addClass('ui-disabled');
				var createGameMessage = $('<h2>To enable game creation, give non-empty game name and select the number of galleries to be added in the game</h2>');
				$('#create-game-message').append(createGameMessage);
				
			} else{
				$('#selectconnection-fieldset').removeClass('hideElement');
				getConnections("populateconnections2");
				if(galleryId >= 2){
					$('#selectgallery1fieldset').removeClass('hideElement');
					$('#selectgallery2fieldset').removeClass('hideElement');
					$('#selectgallery3fieldset').addClass('hideElement');
					$('#selectgallery4fieldset').addClass('hideElement');
				}
				if(galleryId > 2){
					$('#selectgallery3fieldset').removeClass('hideElement');
					$('#selectgallery4fieldset').addClass('hideElement');
				}
				if(galleryId > 3){
					$('#selectgallery4fieldset').removeClass('hideElement');
				}
				var createGameMessage = $('<h2>To enable game creation, give non-empty game name and select galleries and connection</h2>');
				$('#create-game-message').append(createGameMessage);
			}
			
			enableCreateGameButton();
		});

		$('#selectgame').change(function(){
			$('#game-description-message').text("");
			var description = $('option:selected', this).attr('description');
			var gameDescMessage = $('<h2>Game Description: '+description+'</h2>');
			$('#game-description-message').append(gameDescMessage);
			var galleryId = $('select[name=selectgame]').val();
			if(galleryId != 0){
				$('#edit-game-button').find('*').prop('disabled',false);
				$('#edit-game-button').find('*').removeClass('ui-disabled');
				$('#delete-button-game').find('*').prop('disabled',false);
				$('#delete-button-game').find('*').removeClass('ui-disabled');
			}else{
				$('#edit-game-button').find('*').prop('disabled',true);
				$('#edit-game-button').find('*').addClass('ui-disabled');
				$('#delete-button-game').find('*').prop('disabled',true);
				$('#delete-button-game').find('*').addClass('ui-disabled');
				resetEditGameView();
			}
			$('#editgamesection').addClass('hideElement');

		});

		$('#selectgallery1').change(function(){
			enableCreateGameButton();
		});
		$('#selectgallery2').change(function(){
			enableCreateGameButton();
		});
		$('#selectgallery3').change(function(){
			enableCreateGameButton();
		});
		$('#selectgallery4').change(function(){
			enableCreateGameButton();
		});

		
		$('#create-game-button').click(function() {
			createGame();
		});

		$('#game-name').on('change keyup paste',function() { 
			enableCreateGameButton();
		});

		$('#button-create-level').click(function() {
			createLevel();
		});
		

		
	$('#selectedgamegallery1').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
		$(this).siblings().removeClass("active");
		enableCreateLevelButton();
	});

	$('#selectedgamegallery2').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		//$('#create-gallery-message').text("");
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
		$(this).siblings().removeClass("active");
		enableCreateLevelButton();
	});

	$('#selectedgamegallery3').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
	//	$('#create-gallery-message').text("");
	if($(this).hasClass("active")){
		$(this).removeClass("active");
	} else {
		$(this).addClass("active");
	}
	$(this).siblings().removeClass("active");
	enableCreateLevelButton();
});

	$('#selectedgamegallery4').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		//$('#create-gallery-message').text("");
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
		$(this).siblings().removeClass("active");
		enableCreateLevelButton();
	});

	$('#changeconnection').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		$('#changeConnectionMessage').text("");
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$('#change-connection-button').find('*').prop('disabled',true);
			$('#change-connection-button').find('*').addClass('ui-disabled');
		} else {
			$(this).addClass("active");
			$('#change-connection-button').find('*').prop('disabled',false);
			$('#change-connection-button').find('*').removeClass('ui-disabled');
			$('#change-connection-button').css('opacity','1');
		}
		$(this).siblings().removeClass("active");

	});

	
		$('#editconnection2').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
			
			if($(this).hasClass("active")){
				$(this).removeClass("active");
				
			} else {
				$(this).addClass("active");
			}
			$(this).siblings().removeClass("active");
			enableCreateGameButton();

		});


		$('#button-change-connection').click(function() {
			changeConnection();
		});

		$('#button-edit-game').click(function() {
			$('#add-level-message').text("");
			$('#editLevelMessage').text("");
			$('#editgameboard').attr("levelNo",0);
			var addLevelMessage = $('<h2>Select tile from each gallery and enter eLearning link to enable \'Add Level\' button</h2>');
			$('#add-level-message').append(addLevelMessage);
			$('#editgamesection').removeClass('hideElement');
			var gameGallery1 = $('option:selected', $('#selectgame')).attr('gameGallery1');
			getGalleryTiles(gameGallery1,"populategamegallery1");
			var gameGallery2 = $('option:selected', $('#selectgame')).attr('gameGallery2');
			getGalleryTiles(gameGallery2,"populategamegallery2");
			var gameGallery3 = $('option:selected', $('#selectgame')).attr('gameGallery3');
			var gameGallery4 = $('option:selected', $('#selectgame')).attr('gameGallery4');
			NUMBER_OF_GALLERIES = 2;
			if(gameGallery3 !=""){
				NUMBER_OF_GALLERIES = 3;
				$('#gamegallery3-fieldset').removeClass('hideElement');
				$('#editheaderslot2td').removeClass('hideElement');
				$('#edithideslot2').removeClass('hideElement');
				$('#editwrapperslot2').css("display","block");
				getGalleryTiles(gameGallery3,"populategamegallery3");
			}else{
				$('#gamegallery3-fieldset').addClass('hideElement');
				$('#editheaderslot2td').addClass('hideElement');
				$('#edithideslot2').addClass('hideElement');
				$('#editwrapperslot2').css("display","none");
			}
			if(gameGallery4 !=""){
				NUMBER_OF_GALLERIES = 4;
				$('#gamegallery4-fieldset').removeClass('hideElement');
				$('#editheaderslot3td').removeClass('hideElement');
				$('#edithideslot3').removeClass('hideElement');
				$('#editwrapperslot3').css("display","block");
				getGalleryTiles(gameGallery4,"populategamegallery4");
			}else{
				$('#gamegallery4-fieldset').addClass('hideElement');
				$('#editheaderslot3td').addClass('hideElement');
				$('#edithideslot3').addClass('hideElement');
				$('#editwrapperslot3').css("display","none");
			}	
			if(GAMEGALLERYNAMES != null){
				$.each(GAMEGALLERYNAMES, function(index, value) {
					for (var i = 1; i <= NUMBER_OF_GALLERIES; i++) {
						var id= $('option:selected', $('#selectgame')).attr('gameGallery'+i);
						var j = i-1;
						if(id == value.galleryId){
							$('#editheader-slot'+j).empty().append(value.galleryName);
							$('#editheader-gallery'+j).empty().append(value.galleryName);
							$('#header-populategamegallery'+i).empty().append(value.galleryName);
						}
					}

				});	
			}
			var gameId = $('select[name=selectgame]').val();
			getGameLevels(gameId);
			var activeConnection = $('option:selected', $('#selectgame')).attr('gameConnection');
			getGameConnections("populatechangeconnection",activeConnection);	
			
		});
		$('#button-next-level').click(function(){
			changeLevels("next");
		});

		$('#button-previous-level').click(function(){
			changeLevels("previous");
		});

		function changeLevels(direction){
			$('#editLevelMessage').text("");
			var level = $('#editgameboard').attr("levelNo");
			var levelNo = parseInt(level);
			var length = Object.keys(GAMELEVELS).length;
			while(length != 0 && true){
				if(direction == "previous"){
					if(levelNo - 1 < 0 || levelNo > length){
						levelNo = length;
					}else{
						levelNo = levelNo - 1;
					}
				}else if(direction == "next"){
					if(levelNo + 1 > length || levelNo < 0){
						levelNo = 0;
					}else{
						levelNo = levelNo + 1;
					}
				}
				
				if(GAMELEVELS.hasOwnProperty(levelNo)){
					break;
				}
			}

			$('#editgameboard').attr("levelNo",levelNo);
			GetLevel(levelNo);
		}

		$('#button-delete-game').click(function(){
			var gameId = $('select[name=selectgame]').val();
			var gameName = $('#selectgame :selected').text();
			deleteGame(gameId,gameName);
		});

		$('#button-delete-level').click(function(){
			var level = $('#editgameboard').attr("levelNo");
			var levelNo = parseInt(level);
			deleteLevel(levelNo);
		});

		$('#button-save-level').click(function(){
			var level = $('#editgameboard').attr("levelNo");
			var levelNo = parseInt(level);
			saveLevel(levelNo);
		});


		function getGameLevels(gameId){
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

					GAMELEVELS = JSON.parse(data);
					GetLevel(0);
				}
			});
		}

		function getGalleriesList2(element){
			$.ajax({
				url: "lib/database/get_galleries.php",
				type: "GET",
				contentType: false,
				success: function(data){
					//alert(data);
					GALLERYNAMES = data;
					if(GALLERYNAMES != 'NULL'){
						createGalleryList2(element,GALLERYNAMES);
					}
				}
			});
		}

		function getGameGalleriesList(){
			$.ajax({
				url: "lib/database/get_galleries.php",
				type: "GET",
				contentType: false,
				success: function(data){
					GAMEGALLERYNAMES = JSON.parse(data);
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
					GAMENAMES = data;
					if(GAMENAMES != 'NULL'){
						createGamesList(GAMENAMES);
					}
				}
			});
		}

		
		function resetGameCreationView(){
			$('#game-name')[0].value = "";
			$('#game-desc')[0].value = "";
			$('#gallerycount').children().remove();
			$('#gallerycount').append('<option value="'+ 1 +'" description="Select number of galleries to be added in the game">--Select Galleries Count--</option>');
			$('#gallerycount').append('<option value="'+ 2 +'" >2</option>');
			$('#gallerycount').append('<option value="'+ 3 +'" >3</option>');
			$('#gallerycount').append('<option value="'+ 4 +'" >4</option>');
			$('#selectgallery1fieldset').addClass('hideElement');
			$('#selectgallery2fieldset').addClass('hideElement');
			$('#selectgallery3fieldset').addClass('hideElement');
			$('#selectgallery4fieldset').addClass('hideElement');
			$('#selectconnection-fieldset').addClass('hideElement');
			$('#create-game-button').find('*').prop('disabled',true);
			$('#create-game-button').find('*').addClass('ui-disabled');
			getGalleriesList2("selectgallery1");
			getGalleriesList2("selectgallery2");
			getGalleriesList2("selectgallery3");
			getGalleriesList2("selectgallery4");
			$('#create-game-message').text("");
			var createGameMessage = $('<h2>To enable game creation, give non-empty game name and select the number of galleries to be added in the game</h2>');
			$('#create-game-message').append(createGameMessage);
			var myselect = $("select#gallerycount");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");
			
		}

		function resetEditGameView(){
			$('#editgamesection').addClass('hideElement');
			$('#selectgame').children().remove();
			var addLevelMessage = $('<h2>Select tile from each gallery and enter eLearning link to enable \'Add Level\' button</h2>');
			$('#add-level-message').append(addLevelMessage);
			$('#changeConnectionMessage').text("");
			$('#create-level-button').find('*').prop('disabled',true);
			$('#create-level-button').find('*').addClass('ui-disabled');
			getGameGalleriesList();
			getGamesList();
		}

		function enableCreateGameButton(){
			var galleryCountVal = $('select[name=gallerycount]').val();
			var gallery1Val = $('select[name=selectgallery1]').val();
			var gallery2Val = $('select[name=selectgallery2]').val();
			var gallery3Val = $('select[name=selectgallery3]').val();
			var gallery4Val = $('select[name=selectgallery4]').val();
			var validSelector = "false";
			if(galleryCountVal == 2){
				if(gallery1Val != 0 && gallery2Val != 0){
					validSelector = "true";
				}else{
					validSelector = "false";
				}
			}
			if(galleryCountVal == 3){
				if(gallery1Val != 0 && gallery2Val != 0 && gallery3Val != 0){
					validSelector = "true";
				}else{
					validSelector = "false";
				}
			}
			if(galleryCountVal == 4){
				if(gallery1Val != 0 && gallery2Val != 0 && gallery3Val != 0 && gallery4Val != 0){
					validSelector = "true";
				}else{
					validSelector = "false";
				}
			}
			$('#create-game-message').text("");
			var val = $.trim($('#game-name')[0].value);
			if(val != "" && $('#editconnection2').find('*').hasClass("active") && validSelector == "true"){
				$('#create-game-button').find('*').prop('disabled',false);
				$('#create-game-button').find('*').removeClass('ui-disabled');
				var createGameMessage = $('<h2>Click on "Create" to create the game</h2>');
				$('#create-game-message').append(createGameMessage);
			}else{
				var createGameMessage = $('<h2>To enable game creation, give non-empty game name and select galleries and connection</h2>');
				$('#create-game-message').append(createGameMessage);
				$('#create-game-button').find('*').prop('disabled',true);
				$('#create-game-button').find('*').addClass('ui-disabled');
			}
		}
		function enableCreateLevelButton(){
			$('#add-level-message').text("");
			var addLevelMessage = $('<h2>Select tile from each gallery and enter eLearning link to enable \'Add Level\' button. Click on the \'Add Level\' button to add the level to the game</h2>');
			$('#add-level-message').append(addLevelMessage);

			var valid = "true";
			var gameGallery3 = $('option:selected', $('#selectgame')).attr('gameGallery3');
			var gameGallery4 = $('option:selected', $('#selectgame')).attr('gameGallery4');
			if(gameGallery3 != ""){
				if($('#selectedgamegallery3').find('*').hasClass("active")){
					valid = "true";
				}else{
					valid = "false";
				}
			}
			if(gameGallery4 != ""){
				if($('#selectedgamegallery3').find('*').hasClass("active") && $('#selectedgamegallery4').find('*').hasClass("active")){
					valid = "true";
				}else{
					valid = "false";
				}
			}
			if($('#selectedgamegallery1').find('*').hasClass("active") && $('#selectedgamegallery2').find('*').hasClass("active") && valid == "true"){
				$('#add-level-message').text("");
				var addLevelMessage = $('<h2>Click on the \'Add Level\' button to add the level to the game</h2>');
				$('#add-level-message').append(addLevelMessage);
				$('#create-level-button').find('*').prop('disabled',false);
				$('#create-level-button').find('*').removeClass('ui-disabled');
			}else{
				$('#add-level-message').text("");
				var addLevelMessage = $('<h2>Select tile from each gallery and enter eLearning link to enable \'Add Level\' button</h2>');
				$('#add-level-message').append(addLevelMessage);
				$('#create-level-button').find('*').prop('disabled',true);
				$('#create-level-button').find('*').addClass('ui-disabled');

			}


		}

		
		function createGalleryList2(element, data){
			$('#'+element).children().remove();
			$('#'+element).append('<option value="'+ 0 +'" description="Select a gallery from the dropdown and click on \'Edit Gallery\' to edit the gallery tiles">--Select Gallery--</option>');
			jsondata = JSON.parse(data);
			if(jsondata != null){
				$.each(jsondata, function(index, value) {
					$('#'+element).append('<option value="'+ value.galleryId +'" description="'+value.galleryDescription+'">' + value.galleryName + '</option>');
				});
			}
			var myselect = $("select#"+element);
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");
		}

		function createGamesList(data){
			$('#selectgame').children().remove();
			$('#selectgame').append('<option value="'+ 0 +'" description="Select a game from the dropdown and click on \'Edit Game\' to edit the game or \'Delete Game\' to delete the game">--Select Game--</option>');
			jsondata = JSON.parse(data);
			if(jsondata != null){
				$.each(jsondata, function(index, value) {
					$('#selectgame').append('<option value="'+ value.gameId +'" description="'+value.gameDescription+'" gameGallery1="'+value.gallery1Id+'" gameGallery2="'+value.gallery2Id+'" gameGallery3="'+value.gallery3Id+'" gameGallery4="'+value.gallery4Id+'" gameConnection="'+value.connection1Id+'">' + value.gameName + '</option>');
				});
			}
			var myselect1 = $("select#selectgame");
			myselect1[0].selectedIndex = 0;
			myselect1.selectmenu("refresh");

			$('#game-description-message').text("");
			var description = $('option:selected', $('#selectgame')).attr('description');
			var gameDescMessage = $('<h2>'+description+'</h2>');
			$('#game-description-message').append(gameDescMessage);
			$('#edit-game-button').find('*').prop('disabled',true);
			$('#edit-game-button').find('*').addClass('ui-disabled');

			$('#delete-button-game').find('*').prop('disabled',true);
			$('#delete-button-game').find('*').addClass('ui-disabled');

		}

		function getGalleryTiles(galleryId,galleryElement){

			
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("galleryId",galleryId);
			if(formdata){
				$.ajax({
					url: "lib/database/get_gallery_tiles.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						populateGallery(galleryElement,data);
					}
				});
			}
		}

		function changeConnection(){

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			var gameId = $('select[name=selectgame]').val();
			var connectionSrc = $('#changeconnection').find(".active").find(".imgfocus")[0].alt;
			formdata.append("gameId",gameId);
			formdata.append("connectionSrc",connectionSrc);
			
			if(formdata){
				$.ajax({
					url: "lib/database/update_connection.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						$('#changeConnectionMessage').text("");
						var changeConnectionMessage = $('<h2>Connection changed successfully</h2>');
						$('#changeConnectionMessage').append(changeConnectionMessage);
					}
				});
			}
		}

		function getConnections(element){

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			
			if(formdata){
				$.ajax({
					url: "lib/database/get_connections.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						populateConnections(element,data);
					}
				});
			}
		}

		function getGameConnections(element,activeli){

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			
			if(formdata){
				$.ajax({
					url: "lib/database/get_connections.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						populateGameConnections(element,activeli,data);
					}
				});
			}
		}

		function deleteLevel(levelNo){
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}

			formdata.append("id", GAMELEVELS[levelNo]["id"]);
			if(formdata){
				$.ajax({
					url: "lib/database/deleteLevel.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						clearSlots();
						var editLevelMessage = $('<h2>Level deleted successfully!</h2>');
						delete GAMELEVELS[levelNo];
						changeLevels("next");
						$('#editLevelMessage').append(editLevelMessage);
					}
				});
			}

		}


		function deleteGame(gameId,gameName){
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}

			formdata.append("gameId", gameId);
			if(formdata){
				$.ajax({
					url: "lib/database/deleteGame.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						getGamesList();
						$('#game-description-message').text("");
						var gameDescMessage = $('<h2>Game "'+gameName+'" deleted successfully!</h2>');
						$('#game-description-message').append(gameDescMessage);
						refreshGamesAndGalleries();
					}
				});
			}

		}

		function saveLevel(levelNo){
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}

			formdata.append("id", GAMELEVELS[levelNo]["id"]);
			formdata.append("eLearningLink",$.trim($('#eLearningLink')[0].value));
			if(formdata){
				$.ajax({
					url: "lib/database/updateLevel.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						GAMELEVELS[levelNo]["eLearningLink"] = $.trim($('#eLearningLink')[0].value);
						var editLevelMessage = $('<h2>Level saved successfully!</h2>');
						$('#editLevelMessage').append(editLevelMessage);
					}
				});
			}

		}

		
		function createGame(){
			var gameName = $.trim($('#game-name')[0].value);
			var gameDescription = $.trim($('#game-desc')[0].value);
			var gallery1Id = $('select[name=selectgallery1]').val();
			var gallery2Id = $('select[name=selectgallery2]').val();
			var gallery3Id = $('select[name=selectgallery3]').val();
			var gallery4Id = $('select[name=selectgallery4]').val();
			var connectionSrc = $('#editconnection2').find(".active").find(".imgfocus")[0].alt;
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("gameName",gameName);
			formdata.append("gameDescription",gameDescription);
			formdata.append("gallery1Id",gallery1Id);
			formdata.append("gallery2Id",gallery2Id);
			if(gallery3Id != 0){
				formdata.append("gallery3Id",gallery3Id);
			}else{
				formdata.append("gallery3Id","");
			}
			if(gallery4Id != 0){
				formdata.append("gallery4Id",gallery4Id);
			}else{
				formdata.append("gallery4Id","");
			}
			formdata.append("connectionSrc",connectionSrc);
			if(formdata){
				$.ajax({
					url: "lib/database/create_game.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						refreshGamesAndGalleries();
						resetGameCreationView();
						var createGameMessage = $('<h2>Game with name "'+gameName+'" is created successfully! Go to \'Edit Games\' menu to add levels to the game.</h2>');
						$('#create-game-message').append(createGameMessage);
						
					}
				});
			}

		}

		function refreshGamesAndGalleries(){
			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {

			});
		}

		function createLevel(){
			
			var eLearningLink = $.trim($('#newELearningLink')[0].value);
			var gameId = $('select[name=selectgame]').val();
			var gallery1src = $('#selectedgamegallery1').find(".active").find(".imgfocus")[0].alt;
			var gallery2src = $('#selectedgamegallery2').find(".active").find(".imgfocus")[0].alt;

			var gameGallery3 = $('option:selected', $('#selectgame')).attr('gameGallery3');
			var gameGallery4 = $('option:selected', $('#selectgame')).attr('gameGallery4');
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("gameId",gameId);
			formdata.append("gallery1src",gallery1src);
			formdata.append("gallery2src",gallery2src);
			
			if(gameGallery3 != ""){
				var gallery3src = $('#selectedgamegallery3').find(".active").find(".imgfocus")[0].alt;
				formdata.append("gallery3src",gallery3src);
			}else{
				formdata.append("gallery3src","");
			}
			if(gameGallery4 != ""){
				var gallery4src = $('#selectedgamegallery4').find(".active").find(".imgfocus")[0].alt;
				formdata.append("gallery4src",gallery4src);
			}else{
				formdata.append("gallery4src","");
			}
			formdata.append("eLearningLink",eLearningLink);
			if(formdata){
				$.ajax({
					url: "lib/database/create_level.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						$('#add-level-message').text("");
						$('#selectedgamegallery1').find(".active").remove();
						$('#selectedgamegallery2').find(".active").remove();
						if(gameGallery3 != ""){
							$('#selectedgamegallery3').find(".active").remove();
						}
						if(gameGallery4 != ""){
							$('#selectedgamegallery4').find(".active").remove();
						}
						$('#create-level-button').find('*').prop('disabled',true);
						$('#create-level-button').find('*').addClass('ui-disabled');
						var createLevelMessage = $('<h2>New Level is added to the game.</h2>');
						$('#add-level-message').append(createLevelMessage);
						
						getGameLevels(gameId);
					}
				});
			}

		}

		
		function populateGallery(element, filesdata){
			$('#'+element + ' ul').children().remove();
			files = JSON.parse(filesdata);
			if(files != null){
				$.each(files, function(index, value) {
					var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.tileSrc + '" alt="' +  value.tileSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
					rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
				});

				setGalleryWidth();
			}
		}

		function GetLevel(index){

			if(GAMELEVELS.hasOwnProperty(index)){
				for(var i=0;i<NUMBER_OF_GALLERIES;i++){
					var j = i+1;
					var id= "gallery"+j+"src";
					var image = $('<li class="ui-widget-content ui-corner-tr piece"><img src="' + TEMP + GAMELEVELS[index][id] + '" alt="' +  GAMELEVELS[index][id] + '" width="94" height="68" id="piece-id-'+i+'" piece-id="' + i + '" piece-count="1" class="imgfocus"/></li>');
					var slot = $('#editslot' + i);
					slot.children().remove();
					image.appendTo(slot);
				}
				$('#eLearningLink')[0].value = GAMELEVELS[index]["eLearningLink"];	
			}
		}

		function clearSlots(){
			for(var i=0;i<NUMBER_OF_GALLERIES;i++){
				var slot = $('#editslot' + i);
				slot.children().remove();

			}
			$('#eLearningLink')[0].value = "";	
		}
		
		function populateConnections(element, filesdata){
			$('#'+element + ' ul').children().remove();
			files = JSON.parse(filesdata);
			length = files.length;
			if(files != null){
				$.each(files, function(index, value) {
					var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.connectionSrc + '" alt="' +  value.connectionSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
					rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
				});
				setGalleryWidth();
			}
		}

		function populateGameConnections(element, activeli, filesdata){
			$('#'+element + ' ul').children().remove();
			files = JSON.parse(filesdata);
			length = files.length;
			if(files != null){
				$.each(files, function(index, value) {
					var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.connectionSrc + '" alt="' +  value.connectionSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
					rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
					if(value.connectionSrc == activeli){
						image1.addClass('active');
					}
				});
				setGalleryWidth();
			}
		}

		function setGalleryWidth() {
			
			var connWidth2 = $('#populateconnections2').width();
			$('#ulwrap-populateconnections2').width(connWidth2-75);
			CONNECTIONS2ul.width((102 * CONNECTIONS2ul.children().length));

			
			var gameGal1Width = $('#populategamegallery1').width();
			$('#ulwrap-populategamegallery1').width(gameGal1Width-75);
			GAMEGALLERY1ul.width((102 * GAMEGALLERY1ul.children().length));

			var gameGal2Width = $('#populategamegallery2').width();
			$('#ulwrap-populategamegallery2').width(gameGal2Width-75);
			GAMEGALLERY2ul.width((102 * GAMEGALLERY2ul.children().length));

			var gameGal3Width = $('#populategamegallery3').width();
			$('#ulwrap-populategamegallery3').width(gameGal3Width-75);
			GAMEGALLERY3ul.width((102 * GAMEGALLERY3ul.children().length));

			var gameGal4Width = $('#populategamegallery4').width();
			$('#ulwrap-populategamegallery4').width(gameGal4Width-75);
			GAMEGALLERY4ul.width((102 * GAMEGALLERY4ul.children().length));

			var changeConnectionWidth = $('#populatechangeconnection').width();
			$('#ulwrap-populatechangeconnection').width(changeConnectionWidth-75);
			CHANGECONNECTIONul.width((102 * CHANGECONNECTIONul.children().length));

		}

		function setGalleryHeight() {
			var myWidth = 0, myHeight = 0;
			if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
			myWidth = window.innerWidth;
			myHeight = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			//IE 6+ in 'standards compliant mode'
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			//IE 4 compatible
			myWidth = document.body.clientWidth;
			myHeight = document.body.clientHeight;
		}
		
		var galHeight = myHeight*0.6;
		var wrapperHeight = galHeight+110;

	}

});	

