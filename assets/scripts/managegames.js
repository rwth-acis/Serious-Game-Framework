//var UPLOADPATH = "uploads/";
var TEMP = "tmp/";
var oidc_userinfo;
function rand(min, max) {
	if (!DEBUG) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
			// disable random value for debugging
			return min;
		}
	}

	$(document).ready(function() {

		setGalleryHeight();

		var connectionGallery1 = "selectConnections1";
		var connectionGallery2 = "selectConnections2";
		var connectionGallery3 = "selectConnections3";

		var selectGalleryTile1 = "selectGalleryTile1";
		var selectGalleryTile2 = "selectGalleryTile2";
		var selectGalleryTile3 = "selectGalleryTile3";
		var selectGalleryTile4 = "selectGalleryTile4";


		var setConnection1 = "setConnection1";
		var setConnection2 = "setConnection2";
		var setConnection3 = "setConnection3";

		var CONNECTIONS1 = $("#"+connectionGallery1),
		CONNECTIONS1ul = $("ul", CONNECTIONS1);
		
		var CONNECTIONS2 = $("#"+connectionGallery2),
		CONNECTIONS2ul = $("ul", CONNECTIONS2);

		var CONNECTIONS3 = $("#"+connectionGallery3),
		CONNECTIONS3ul = $("ul", CONNECTIONS3);

		var GAMEGALLERY1 = $("#"+selectGalleryTile1),
		GAMEGALLERY1ul = $("ul", GAMEGALLERY1);

		var GAMEGALLERY2 = $("#"+selectGalleryTile2),
		GAMEGALLERY2ul = $("ul", GAMEGALLERY2);

		var GAMEGALLERY3 = $("#"+selectGalleryTile3),
		GAMEGALLERY3ul = $("ul", GAMEGALLERY3);

		var GAMEGALLERY4 = $("#"+selectGalleryTile4),
		GAMEGALLERY4ul = $("ul", GAMEGALLERY4);

		var CHANGECONNECTION1 = $("#"+setConnection1),
		CHANGECONNECTION1ul = $("ul", CHANGECONNECTION1);

		var CHANGECONNECTION2 = $("#"+setConnection2),
		CHANGECONNECTION2ul = $("ul", CHANGECONNECTION2);

		var CHANGECONNECTION3 = $("#"+setConnection3),
		CHANGECONNECTION3ul = $("ul", CHANGECONNECTION3);

		var GALLERYNAMES;
		var GAMEGALLERYNAMES;
		var GAMENAMES;
		var GAMELEVELS;
		var NUMBER_OF_GALLERIES;
		var GAMECATEGORIES;
		var color = "brown";

		var LAST_LEVEL_NUM_DELETED = "";
		var LAST_DELETED_GAME_ID = "";
		var LAST_DELETED_GAME_NAME = "";

		$('.select').find('option').css("height","20px"); 


		$(window).resize(function() {
			setGalleryHeight();
			setGalleryWidth();
		});

		
		$('#creategameslink').click(function() { 
			$('#game-designer-name')[0].value = "";
			$('#game-designer-institution')[0].value = "";
			$('#game-designer-email')[0].value = "";
			reloadDataFromDatabase1();
		});

		$('#editgameslink').click(function() { 
			reloadDataFromDatabase2();
		});

		$('#gallerycount').change(function(){
			$('#create-game-message').text("");
			var galleryId = $('select[name=gallerycount]').val();
			if(galleryId < 2){
				$('#selectgallery1fieldset').addClass('hideElement');
				$('#selectgallery2fieldset').addClass('hideElement');
				$('#selectgallery3fieldset').addClass('hideElement');
				$('#selectgallery4fieldset').addClass('hideElement');
				$('#selectconnection1-fieldset').addClass('hideElement');
				$('#selectconnection2-fieldset').addClass('hideElement');
				$('#selectconnection3-fieldset').addClass('hideElement');
				$('#create-game-button').find('*').prop('disabled',true);
				$('#create-game-button').find('*').addClass('ui-disabled');
				var createGameMessage = $('<h2 style="color:'+color+';">To enable game creation, give non-empty game name and select the number of galleries to be added in the game</h2>');
				$('#create-game-message').append(createGameMessage);
				
			} else{
				$('#selectconnection1-fieldset').removeClass('hideElement');
				getConnections(connectionGallery1);
				if(galleryId >= 2){
					$('#selectgallery1fieldset').removeClass('hideElement');
					$('#selectgallery2fieldset').removeClass('hideElement');
					$('#selectgallery3fieldset').addClass('hideElement');
					$('#selectgallery4fieldset').addClass('hideElement');
					$('#selectconnection2-fieldset').addClass('hideElement');
					$('#selectconnection3-fieldset').addClass('hideElement');
				}
				if(galleryId > 2){
					$('#selectgallery3fieldset').removeClass('hideElement');
					$('#selectgallery4fieldset').addClass('hideElement');
					$('#selectconnection2-fieldset').removeClass('hideElement');
					getConnections(connectionGallery2);
					$('#selectconnection3-fieldset').addClass('hideElement');
				
				}
				if(galleryId > 3){
					$('#selectgallery4fieldset').removeClass('hideElement');
					$('#selectconnection3-fieldset').removeClass('hideElement');
					getConnections(connectionGallery3);
				}
				var createGameMessage = $('<h2 style="color:'+color+';">To enable game creation, give non-empty game name and select galleries and connection</h2>');
				$('#create-game-message').append(createGameMessage);
			}
			
			enableCreateGameButton();
		});

		$('#selectgame').change(function(){
			$('#game-description-message').text("");
			$('#edit-game-details-message').text("");
			$('#game-undo-delete-button').fadeOut();
			//var description = $('option:selected', this).attr('description');
			$('#game-description-message').text("");
			var gameId = $('select[name=selectgame]').val();
			var description = "";
			if(gameId != 0){
				$('#edit-game-button').find('*').prop('disabled',false);
				$('#edit-game-button').find('*').removeClass('ui-disabled');
				$('#delete-button-game').find('*').prop('disabled',false);
				$('#delete-button-game').find('*').removeClass('ui-disabled');
				var gameIndex = $('option:selected', this).attr('gameIndex');
				description = GAMESDATA[gameIndex].gameDescription;
				var gameDescMessage = $('<h2 style="color:'+color+';">Game Description: '+description+'</h2>');
				$('#game-description-message').append(gameDescMessage);
			}else{
				$('#edit-game-button').find('*').prop('disabled',true);
				$('#edit-game-button').find('*').addClass('ui-disabled');
				$('#delete-button-game').find('*').prop('disabled',true);
				$('#delete-button-game').find('*').addClass('ui-disabled');
			//	description = $('option:selected', this).attr('description');
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

		$('#gameCategory').change(function(){

			if($('select[name=gameCategory]').val() != "0"){
				$('#game-new-category')[0].value = "";
				$("#game-new-category").attr('disabled','disabled');
				$("#game-new-category").parent().css( "background-color", "#e7e7e7" );
			}else{
				$('#game-new-category').parent().parent().find('*').removeAttr('disabled');
				$('#game-new-category').parent().parent().find('*').removeClass('ui-disabled');
				$('#game-new-category').parent().parent().find('*').removeClass('ui-state-disabled');
				$("#game-new-category").parent().parent().find('*').css( "background-color", "" );
			}
					
		});

		$('#editGameCategory').change(function(){
			$('#edit-game-details-message').text("");

			if($('select[name=editGameCategory]').val() != "0"){
				$("#edit-game-new-category").attr('disabled','disabled');
				$("#edit-game-new-category").parent().css( "background-color", "#e7e7e7" );
			}else{
				$('#edit-game-new-category').parent().parent().find('*').removeAttr('disabled');
				$('#edit-game-new-category').parent().parent().find('*').removeClass('ui-disabled');
				$('#edit-game-new-category').parent().parent().find('*').removeClass('ui-state-disabled');
				$("#edit-game-new-category").parent().parent().find('*').css( "background-color", "" );
			}
			
		});
		$(document).on('keypress', function() {
   			$('#edit-game-details-message').text("");
   			$('#level-undo-delete-button').fadeOut();
   			$('#game-undo-delete-button').fadeOut();
		});
		
		$('#create-game-button').click(function() {
			createGame();
		});

		$('#game-name').on('change keyup paste',function() { 
			enableCreateGameButton();
		});

		$('#game-new-category').on('change keyup paste',function() { 
			enableCreateGameButton();
		});

		$('#button-create-level').click(function() {
			createLevel();
		});
		

		
	$('#edit'+selectGalleryTile1).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
		$(this).siblings().removeClass("active");
		enableCreateLevelButton();
	});

	$('#edit'+selectGalleryTile2).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		//$('#create-gallery-message').text("");
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
		$(this).siblings().removeClass("active");
		enableCreateLevelButton();
	});

	$('#edit'+selectGalleryTile3).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
	//	$('#create-gallery-message').text("");
	if($(this).hasClass("active")){
		$(this).removeClass("active");
	} else {
		$(this).addClass("active");
	}
	$(this).siblings().removeClass("active");
	enableCreateLevelButton();
});

	$('#edit'+selectGalleryTile4).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		//$('#create-gallery-message').text("");
		if($(this).hasClass("active")){
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
		$(this).siblings().removeClass("active");
		enableCreateLevelButton();
	});

	$('#edit'+setConnection1).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		$('#changeConnectionMessage').text("");
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$('#change-connection-button1').find('*').prop('disabled',true);
			$('#change-connection-button1').find('*').addClass('ui-disabled');
		} else {
			$(this).addClass("active");
			$('#change-connection-button1').find('*').prop('disabled',false);
			$('#change-connection-button1').find('*').removeClass('ui-disabled');
			$('#change-connection-button1').css('opacity','1');
		}
		$(this).siblings().removeClass("active");

	});

	$('#edit'+setConnection2).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		$('#changeConnectionMessage').text("");
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$('#change-connection-button2').find('*').prop('disabled',true);
			$('#change-connection-button2').find('*').addClass('ui-disabled');
		} else {
			$(this).addClass("active");
			$('#change-connection-button2').find('*').prop('disabled',false);
			$('#change-connection-button2').find('*').removeClass('ui-disabled');
			$('#change-connection-button2').css('opacity','1');
		}
		$(this).siblings().removeClass("active");

	});

	$('#edit'+setConnection3).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		$('#changeConnectionMessage').text("");
		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$('#change-connection-button3').find('*').prop('disabled',true);
			$('#change-connection-button3').find('*').addClass('ui-disabled');
		} else {
			$(this).addClass("active");
			$('#change-connection-button3').find('*').prop('disabled',false);
			$('#change-connection-button3').find('*').removeClass('ui-disabled');
			$('#change-connection-button3').css('opacity','1');
		}
		$(this).siblings().removeClass("active");

	});

	
		$('#edit'+connectionGallery1).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
			
			if($(this).hasClass("active")){
				$(this).removeClass("active");
				
			} else {
				$(this).addClass("active");
			}
			$(this).siblings().removeClass("active");
			enableCreateGameButton();

		});

		$('#edit'+connectionGallery2).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
			
			if($(this).hasClass("active")){
				$(this).removeClass("active");
				
			} else {
				$(this).addClass("active");
			}
			$(this).siblings().removeClass("active");
			enableCreateGameButton();

		});

		$('#edit'+connectionGallery3).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
			
			if($(this).hasClass("active")){
				$(this).removeClass("active");
				
			} else {
				$(this).addClass("active");
			}
			$(this).siblings().removeClass("active");
			enableCreateGameButton();

		});


		$('#button-change-connection1').click(function() {
			changeConnection1();
		});


		$('#button-change-connection2').click(function() {
			changeConnection2();
		});


		$('#button-change-connection3').click(function() {
			changeConnection3();
		});

		$('#button-edit-game').click(function() {
			$('#add-level-message').text("");
			$('#editLevelMessage').text("");
			$('#editgameboard').attr("levelNo",0);
			$('#game-undo-delete-button').fadeOut();
			var gameIndex = $('option:selected', $('#selectgame')).attr('gameIndex');
			var description = GAMESDATA[gameIndex].gameDescription;
			var gameDescMessage = $('<h2 style="color:'+color+';">Game Description: '+description+'</h2>');
			$('#game-description-message').text("");
			$('#game-description-message').append(gameDescMessage);

			var addLevelMessage = $('<h2 style="color:'+color+';">Select tile from each gallery and enter eLearning link to enable \'Add Level\' button</h2>');
			$('#add-level-message').append(addLevelMessage);
			$('#editgamesection').removeClass('hideElement');
			getGameDetails(gameIndex);
			var gameGallery1 = $('option:selected', $('#selectgame')).attr('gameGallery1');
			getGalleryTiles(gameGallery1,selectGalleryTile1);
			var gameGallery2 = $('option:selected', $('#selectgame')).attr('gameGallery2');
			getGalleryTiles(gameGallery2,selectGalleryTile2);
			var gameGallery3 = $('option:selected', $('#selectgame')).attr('gameGallery3');
			var gameGallery4 = $('option:selected', $('#selectgame')).attr('gameGallery4');
			NUMBER_OF_GALLERIES = 2;
			var activeConnection1 = $('option:selected', $('#selectgame')).attr('gameConnection1');
			getGameConnections(setConnection1,activeConnection1);
			if(gameGallery3 !=""){
				NUMBER_OF_GALLERIES = 3;
				$('#gamegallery3-fieldset').removeClass('hideElement');
				$('#editheaderslot2td').removeClass('hideElement');
				$('#edithideslot2').removeClass('hideElement');
				$('#editwrapperslot2').css("display","block");
				$('#changeconnection2-fieldset').removeClass('hideElement');
				getGalleryTiles(gameGallery3,selectGalleryTile3);
				var activeConnection2 = $('option:selected', $('#selectgame')).attr('gameConnection2');
				getGameConnections(setConnection2,activeConnection2);
			}else{
				$('#gamegallery3-fieldset').addClass('hideElement');
				$('#changeconnection2-fieldset').addClass('hideElement');
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
				$('#changeconnection3-fieldset').removeClass('hideElement');
				getGalleryTiles(gameGallery4,selectGalleryTile4);
				var activeConnection3 = $('option:selected', $('#selectgame')).attr('gameConnection3');
				getGameConnections(setConnection3,activeConnection3);
			}else{
				$('#gamegallery4-fieldset').addClass('hideElement');
				$('#changeconnection3-fieldset').addClass('hideElement');
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
							$('#header-selectGalleryTile'+i).empty().append(value.galleryName);
						}
					}

				});	
			}
			var gameId = $('select[name=selectgame]').val();
			getGameLevels(gameId);
					
		});

		
		$('#button-next-level').click(function(){
			$('#level-undo-delete-button').fadeOut();
			changeLevels("next");
		});

		$('#button-previous-level').click(function(){
			$('#level-undo-delete-button').fadeOut();
			changeLevels("previous");
		});

		function getGameDetails(gameIndex){
			$('#edit-game-designer-name')[0].value = GAMESDATA[gameIndex].gameDesignerName;
			$('#edit-game-designer-institution')[0].value = GAMESDATA[gameIndex].gameDesignerInstitution;
			$('#edit-game-designer-email')[0].value = GAMESDATA[gameIndex].gameDesignerEmail;
			$('#edit-game-name')[0].value = GAMESDATA[gameIndex].gameName;
			$('#edit-game-new-category')[0].value = GAMESDATA[gameIndex].gameCategory;
			$('#edit-game-desc')[0].value = GAMESDATA[gameIndex].gameDescription;
			$('#edit-game-desc-text')[0].value = GAMESDATA[gameIndex].gameDescriptionText;
		}

		function changeLevels(direction){
			$('#editLevelMessage').text("");
			var level = $('#editgameboard').attr("levelNo");
			var levelNo = parseInt(level);
			var length = Object.keys(GAMELEVELS).length;
			while(length != 0){
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
			LAST_DELETED_GAME_ID = gameId;
			LAST_DELETED_GAME_NAME = gameName;
			deleteGame(gameId,gameName);
		});

		$('#game-undo-delete-button').click(function () {
			undoDeleteGame(LAST_DELETED_GAME_ID,LAST_DELETED_GAME_NAME);
		});

		$('#button-delete-level').click(function(){
			var level = $('#editgameboard').attr("levelNo");
			var levelNo = parseInt(level);
			deleteLevel(levelNo);
		});

		$('#button-undo-delete-level').click(function(){
			undoDeleteLevel();
		});

		$('#button-save-level').click(function(){
			var level = $('#editgameboard').attr("levelNo");
			var levelNo = parseInt(level);
			saveLevel(levelNo);
		});

		$('#button-save-game').click(function(){
			updateGameDetails();
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

		function refreshGamesListAfterEditing(type,gameName){
			$.ajax({
				url: "lib/database/get_games.php",
				type: "GET",
				contentType: false,
				success: function(data){
					//alert(data);
					GAMESDATA = JSON.parse(data);
					resetEditGameView();
					$('#game-description-message').text("");
					var gameDescMessage = "";
					if(type == "delete"){
					$('#game-undo-delete-button').fadeIn();
					
					 gameDescMessage = $('<h2 style="color:#630303;">Game "'+gameName+'" deleted successfully!</h2>');
					
					}else{
						gameDescMessage = $('<h2 style="color:#630303;">Game "'+gameName+'" restored successfully!</h2>');
					}
					$('#game-description-message').append(gameDescMessage);
				}
			});
		}

		function getCategoriesList(elementName){
			$.ajax({
				url: "lib/database/get_categories.php",
				type: "GET",
				contentType: false,
				success: function(data){
					//alert(data);
					GAMECATEGORIES = data;
					if(GAMECATEGORIES != 'NULL'){
						createCategoriesList(elementName, GAMECATEGORIES);
					}
				}
			});
		}

		
		function resetGameCreationView(){
			$('#game-name')[0].value = "";
			$('#game-desc')[0].value = "";
			$('#game-desc-text')[0].value = "";
			$('#game-new-category')[0].value = "";
			$('#gallerycount').children().remove();
			$('#gallerycount').append('<option value="'+ 1 +'" description="Select number of galleries to be added in the game">--Select Galleries Count--</option>');
			$('#gallerycount').append('<option value="'+ 2 +'" >2</option>');
			$('#gallerycount').append('<option value="'+ 3 +'" >3</option>');
			$('#gallerycount').append('<option value="'+ 4 +'" >4</option>');
			$('#selectgallery1fieldset').addClass('hideElement');
			$('#selectgallery2fieldset').addClass('hideElement');
			$('#selectgallery3fieldset').addClass('hideElement');
			$('#selectgallery4fieldset').addClass('hideElement');
			$('#selectconnection1-fieldset').addClass('hideElement');
			$('#selectconnection2-fieldset').addClass('hideElement');
			$('#selectconnection3-fieldset').addClass('hideElement');
			$('#create-game-button').find('*').prop('disabled',true);
			$('#create-game-button').find('*').addClass('ui-disabled');

			$('#header-'+connectionGallery1).empty().append("Select Connection 1");
			$('#header-'+connectionGallery2).empty().append("Select Connection 2");
			$('#header-'+connectionGallery3).empty().append("Select Connection 3");
			getGalleriesList2("selectgallery1");
			getGalleriesList2("selectgallery2");
			getGalleriesList2("selectgallery3");
			getGalleriesList2("selectgallery4");
			getCategoriesList("gameCategory");
			$('#create-game-message').text("");
			var createGameMessage = $('<h2 style="color:'+color+';">To enable game creation, give non-empty game name and select the number of galleries to be added in the game</h2>');
			$('#create-game-message').append(createGameMessage);
			setButtonColor($('#create-game-button'));
			setButtonColor($('#view-gallery1-button'));
			setButtonColor($('#view-gallery2-button'));
			setButtonColor($('#view-gallery3-button'));
			setButtonColor($('#view-gallery4-button'));
			setButtonColor($("#gallerycount").parent());
			var myselect = $("select#gallerycount");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");
			

			
		}

		function resetEditGameView(){
			$('#editgamesection').addClass('hideElement');
			$('#selectgame').children().remove();
			var addLevelMessage = $('<h2 style="color:'+color+';">Select tile from each gallery and enter eLearning link to enable \'Add Level\' button</h2>');
			$('#add-level-message').append(addLevelMessage);
			$('#changeConnectionMessage').text("");
			$('#create-level-button').find('*').prop('disabled',true);
			$('#create-level-button').find('*').addClass('ui-disabled');
			getGameGalleriesList();
			getCategoriesList("editGameCategory");
			createGamesList(GAMESDATA);
			setButtonColor($('#edit-game-button'));
			setButtonColor($('#delete-button-game'));
			setButtonColor($('#game-undo-delete-button'));
			setButtonColor($('#save-game-button'));
			setButtonColor($('#create-level-button'));
			setButtonColor($('#previous-level-button'));
			setButtonColor($('#next-level-button'));
			setButtonColor($('#level-delete-button'));
			setButtonColor($('#level-undo-delete-button'));
			setButtonColor($('#save-level-button'));
			setButtonColor($('#change-connection-button1'));
			setButtonColor($('#change-connection-button2'));
			setButtonColor($('#change-connection-button3'));
			$('#level-undo-delete-button').fadeOut();
			$('#game-undo-delete-button').fadeOut();
		}

		function setButtonColor(divName){
		if (divName.find('*').hasClass('ui-btn-inner')) {
			divName.find('*').css("color",color);
		} 
		else {
			divName.trigger('create');
			divName.find('*').css("color",color);
		}
	}

		function enableCreateGameButton(){
			var galleryCountVal = $('select[name=gallerycount]').val();
			var gallery1Val = $('select[name=selectgallery1]').val();
			var gallery2Val = $('select[name=selectgallery2]').val();
			var gallery3Val = $('select[name=selectgallery3]').val();
			var gallery4Val = $('select[name=selectgallery4]').val();
			var gameCategory = $('select[name=gameCategory]').val();
			var validSelector = "false";
			if(galleryCountVal == 2){
				if(gallery1Val != 0 && gallery2Val != 0 && $('#edit'+connectionGallery1).find('*').hasClass("active")){
					validSelector = "true";
				}else{
					validSelector = "false";
				}
			}
			if(galleryCountVal == 3){
				if(gallery1Val != 0 && gallery2Val != 0 && gallery3Val != 0 && $('#edit'+connectionGallery1).find('*').hasClass("active") && $('#edit'+connectionGallery2).find('*').hasClass("active")){
					validSelector = "true";
				}else{
					validSelector = "false";
				}
			}
			if(galleryCountVal == 4){
				if(gallery1Val != 0 && gallery2Val != 0 && gallery3Val != 0 && gallery4Val != 0 && $('#edit'+connectionGallery1).find('*').hasClass("active") && $('#edit'+connectionGallery2).find('*').hasClass("active") && $('#edit'+connectionGallery3).find('*').hasClass("active")){
					validSelector = "true";
				}else{
					validSelector = "false";
				}
			}
			if(gameCategory == "0"){
				gameCategory = $.trim($('#game-new-category')[0].value);
			}

			if(gameCategory == ""){
				gameCategory = "Other";
			}

			$('#create-game-message').text("");
			var val = $.trim($('#game-name')[0].value);
			if(val != "" && validSelector == "true"){
				$('#create-game-button').find('*').prop('disabled',false);
				$('#create-game-button').find('*').removeClass('ui-disabled');
				var createGameMessage = $('<h2 style="color:'+color+';">Click on "Create" to create the game</h2>');
				$('#create-game-message').append(createGameMessage);
			}else{
				var createGameMessage = $('<h2 style="color:'+color+';">To enable game creation, give non-empty game name and select galleries and connections</h2>');
				$('#create-game-message').append(createGameMessage);
				$('#create-game-button').find('*').prop('disabled',true);
				$('#create-game-button').find('*').addClass('ui-disabled');
			}
		}
		function enableCreateLevelButton(){
			$('#add-level-message').text("");
			var addLevelMessage = $('<h2 style="color:'+color+';">Select tile from each gallery and enter eLearning link to enable \'Add Level\' button. Click on the \'Add Level\' button to add the level to the game</h2>');
			$('#add-level-message').append(addLevelMessage);

			var valid = "true";
			var gameGallery3 = $('option:selected', $('#selectgame')).attr('gameGallery3');
			var gameGallery4 = $('option:selected', $('#selectgame')).attr('gameGallery4');
			if(gameGallery3 != ""){
				if($('#edit'+selectGalleryTile3).find('*').hasClass("active")){
					valid = "true";
				}else{
					valid = "false";
				}
			}
			if(gameGallery4 != ""){
				if($('#edit'+selectGalleryTile3).find('*').hasClass("active") && $('#edit'+selectGalleryTile4).find('*').hasClass("active")){
					valid = "true";
				}else{
					valid = "false";
				}
			}
			if($('#edit'+selectGalleryTile1).find('*').hasClass("active") && $('#edit'+selectGalleryTile2).find('*').hasClass("active") && valid == "true"){
				$('#add-level-message').text("");
				var addLevelMessage = $('<h2 style="color:'+color+';">Click on the \'Add Level\' button to add the level to the game</h2>');
				$('#add-level-message').append(addLevelMessage);
				$('#create-level-button').find('*').prop('disabled',false);
				$('#create-level-button').find('*').removeClass('ui-disabled');
			}else{
				$('#add-level-message').text("");
				var addLevelMessage = $('<h2 style="color:'+color+';">Select tile from each gallery and enter eLearning link to enable \'Add Level\' button</h2>');
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
					if(value.galleryName != "1" && value.galleryName != "2" && value.galleryName != "3" && value.galleryName != "4"){
						$('#'+element).append('<option value="'+ value.galleryId +'" description="'+value.galleryDescription+'">' + value.galleryName + '</option>');
					}
				});
			}
			var myselect = $("select#"+element);
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");
			setButtonColor($("#"+element).parent());
		}

		function createGamesList(data){
			$('#selectgame').children().remove();
			$('#selectgame').append('<option value="'+ 0 +'" description="Select a game from the dropdown and click on \'Edit Game\' to edit the game or \'Delete Game\' to delete the game">--Select Game--</option>');
			//jsondata = JSON.parse(data);
			jsondata = data;
			if(jsondata != null && jsondata != undefined && jsondata.length != 0){
				$.each(jsondata, function(index, value) {
					if(value.gameName != "Tutorial" && value.oidcEmail == oidc_userinfo.email){
						$('#selectgame').append('<option value="'+ value.gameId +'" gameIndex="'+index+'" description="'+value.gameDescription+'" gameGallery1="'+value.gallery1Id+'" gameGallery2="'+value.gallery2Id+'" gameGallery3="'+value.gallery3Id+'" gameGallery4="'+value.gallery4Id+'" gameConnection1="'+value.connection1Id+'" gameConnection2="'+value.connection2Id+'" gameConnection3="'+value.connection3Id+'">' + value.gameName + '</option>');
					}
				});
			}
			$('#game-description-message').text("");
			var description = $('option:selected', $('#selectgame')).attr('description');
			var gameDescMessage = $('<h2 style="color:'+color+';">'+description+'</h2>');
			$('#game-description-message').append(gameDescMessage);
			$('#edit-game-button').find('*').prop('disabled',true);
			$('#edit-game-button').find('*').addClass('ui-disabled');

			$('#delete-button-game').find('*').prop('disabled',true);
			$('#delete-button-game').find('*').addClass('ui-disabled');
			setButtonColor($("#selectgame").parent());
			var myselect1 = $('select#selectgame');
			myselect1[0].selectedIndex = 0;
			myselect1.selectmenu("refresh");
			
		}

		function createCategoriesList(elementName, data){
			$('#'+elementName).children().remove();
			$('#'+elementName).append('<option value="'+ 0 +'">--Select Category or Create New Below--</option>');
			jsondata = JSON.parse(data);
			if(jsondata != null){
				$.each(jsondata, function(index, value) {
					if(value.gameCategory != null){
						$('#'+elementName).append('<option value="'+ index+1 +'">' + value.gameCategory + '</option>');
					}
				});
			}
			setButtonColor($("#"+elementName).parent());
			var myselect1 = $("select#"+elementName);
			myselect1[0].selectedIndex = 0;
			myselect1.selectmenu("refresh");
			
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

		function changeConnection1(){

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			var gameId = $('select[name=selectgame]').val();
			var connectionSrc1 = $('#edit'+setConnection1).find(".active").find(".imgfocus")[0].alt;
			formdata.append("gameId",gameId);
			formdata.append("connectionSrc1",connectionSrc1);
			if(formdata){
				$.ajax({
					url: "lib/database/update_connection.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						refreshGamesAndGalleries();
						$('#changeConnectionMessage').text("");
						var changeConnectionMessage = $('<h2 style="color:#630303;">Connection changed successfully</h2>');
						$('#changeConnectionMessage').append(changeConnectionMessage);
					}
				});
			}
		}


		function changeConnection2(){

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			var gameId = $('select[name=selectgame]').val();
			var connectionSrc2 = $('#edit'+setConnection2).find(".active").find(".imgfocus")[0].alt;
			formdata.append("gameId",gameId);
			formdata.append("connectionSrc2",connectionSrc2);
			if(formdata){
				$.ajax({
					url: "lib/database/update_connection2.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						refreshGamesAndGalleries();
						$('#changeConnectionMessage').text("");
						var changeConnectionMessage = $('<h2 style="color:#630303;">Connection changed successfully</h2>');
						$('#changeConnectionMessage').append(changeConnectionMessage);
					}
				});
			}
		}


		function changeConnection3(){

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			var gameId = $('select[name=selectgame]').val();
			var connectionSrc3 = $('#edit'+setConnection3).find(".active").find(".imgfocus")[0].alt;
			formdata.append("gameId",gameId);
			formdata.append("connectionSrc3",connectionSrc3);
			if(formdata){
				$.ajax({
					url: "lib/database/update_connection3.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						refreshGamesAndGalleries();
						$('#changeConnectionMessage').text("");
						var changeConnectionMessage = $('<h2 style="color:#630303;">Connection changed successfully</h2>');
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
			$('#level-undo-delete-button').fadeIn();
			LAST_LEVEL_NUM_DELETED = GAMELEVELS[levelNo]["id"];
			formdata.append("deleted","true");
			formdata.append("id", GAMELEVELS[levelNo]["id"]);
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoLevel.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						clearSlots();
						$('#editLevelMessage').text("");
						var editLevelMessage = $('<h2 style="color:#630303;">Level deleted successfully!</h2>');
						delete GAMELEVELS[levelNo];
						changeLevels("next");
						$('#editLevelMessage').append(editLevelMessage);
					}
				});
			}

		}

		function undoDeleteLevel(levelNo){
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			$('#level-undo-delete-button').fadeOut();
			formdata.append("deleted","false");
			formdata.append("id", LAST_LEVEL_NUM_DELETED);
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoLevel.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						clearSlots();
						getGameLevels($('select[name=selectgame]').val());
						$('#editLevelMessage').text("");
						var editLevelMessage = $('<h2 style="color:#630303;">Level restored successfully!</h2>');
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
			
			formdata.append("deleted","true");
			formdata.append("gameId", gameId);
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoGame.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						refreshGamesListAfterEditing("delete",gameName);
					
					}
				});
			}

		}

		function undoDeleteGame(gameId,gameName){
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("deleted","false");
			formdata.append("gameId", gameId);
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoGame.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						refreshGamesListAfterEditing("undo",gameName);
						
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
			formdata.append("moreInformation",$.trim($('#moreInformationLink')[0].value));
			if(formdata){
				$.ajax({
					url: "lib/database/updateLevel.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						GAMELEVELS[levelNo]["eLearningLink"] = $.trim($('#eLearningLink')[0].value);
						GAMELEVELS[levelNo]["moreInformation"] = $.trim($('#moreInformationLink')[0].value);
						var editLevelMessage = $('<h2 style="color:'+color+';">Level saved successfully!</h2>');
						$('#editLevelMessage').append(editLevelMessage);
					}
				});
			}

		}

		function updateGameDetails(){
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}

			var gameIndex = $('option:selected', $('#selectgame')).attr('gameIndex');

			var gameCategory = $('select[name=editGameCategory]').val();
			if(gameCategory == "0"){
				gameCategory = $.trim($('#edit-game-new-category')[0].value);
			}else{
				gameCategory = $('option:selected', $('#editGameCategory')).text();
			}
			if(gameCategory == ""){
				gameCategory = "Other";
			}

			formdata.append("gameId", GAMESDATA[gameIndex].gameId);
			formdata.append("gameName",$.trim($('#edit-game-name')[0].value));
			formdata.append("gameDescription",$.trim($('#edit-game-desc')[0].value));
			formdata.append("gameCategory",gameCategory);
			formdata.append("gameDescriptionText",$.trim($('#edit-game-desc-text')[0].value));
			formdata.append("gameDesignerName",$.trim($('#edit-game-designer-name')[0].value));
			formdata.append("gameDesignerInstitution",$.trim($('#edit-game-designer-institution')[0].value));
			formdata.append("gameDesignerEmail",$.trim($('#edit-game-designer-email')[0].value));

			if(formdata){
				$.ajax({
					url: "lib/database/update_game.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						GAMESDATA[gameIndex]["gameName"] = $.trim($('#edit-game-name')[0].value);
						GAMESDATA[gameIndex]["gameDescription"] = $.trim($('#edit-game-desc')[0].value);
						GAMESDATA[gameIndex]["gameCategory"] = gameCategory;
						GAMESDATA[gameIndex]["gameDescriptionText"] = $.trim($('#edit-game-desc-text')[0].value);
						GAMESDATA[gameIndex]["gameDesignerName"] = $.trim($('#edit-game-designer-name')[0].value);
						GAMESDATA[gameIndex]["gameDesignerInstitution"] = $.trim($('#edit-game-designer-institution')[0].value);
						GAMESDATA[gameIndex]["gameDesignerEmail"] = $.trim($('#edit-game-designer-email')[0].value);

						var description = GAMESDATA[gameIndex].gameDescription;
						$('#game-description-message').text("");
						var gameDescMessage = $('<h2 style="color:'+color+';">Game Description: '+description+'</h2>');
						$('#game-description-message').append(gameDescMessage);

						$('#edit-game-details-message').text("");
						var saveGameDetailsMessage = $('<h2 style="color:#630303;">Game Details saved successfully!</h2>');
						$('#edit-game-details-message').append(saveGameDetailsMessage);
					}
				});
			}

		}

		
		function createGame(){
			var gameName = $.trim($('#game-name')[0].value);
			var gameDescription = $.trim($('#game-desc')[0].value);
			var gameDescriptionText = $.trim($('#game-desc-text')[0].value);
			var gameDesignerName = $.trim($('#game-designer-name')[0].value);
			var gameDesignerInstitution = $.trim($('#game-designer-institution')[0].value);
			var gameDesignerEmail = $.trim($('#game-designer-email')[0].value);
			var gallery1Id = $('select[name=selectgallery1]').val();
			var gallery2Id = $('select[name=selectgallery2]').val();
			var gallery3Id = $('select[name=selectgallery3]').val();
			var gallery4Id = $('select[name=selectgallery4]').val();
			var connectionSrc1 = $('#edit'+connectionGallery1).find(".active").find(".imgfocus")[0].alt;
			var connectionSrc2 = "";
			if($('#edit'+connectionGallery2).find(".active").length != 0){
				connectionSrc2 = $('#edit'+connectionGallery2).find(".active").find(".imgfocus")[0].alt;
			}
			var connectionSrc3 = "";
			if($('#edit'+connectionGallery3).find(".active").length != 0){
				connectionSrc3 = $('#edit'+connectionGallery3).find(".active").find(".imgfocus")[0].alt;
			}
			var gameCategory =  $('select[name=gameCategory]').val();
			if(gameCategory == "0"){
				gameCategory = $.trim($('#game-new-category')[0].value);
			}else{
				gameCategory = $('option:selected', $('#gameCategory')).text();
			}
			if(gameCategory == ""){
				gameCategory = "Other";
			}
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("gameName",gameName);
			formdata.append("gameDescription",gameDescription);
			formdata.append("gameDescriptionText",gameDescriptionText);
			formdata.append("gameDesignerName",gameDesignerName);
			formdata.append("gameDesignerInstitution",gameDesignerInstitution);
			formdata.append("gameDesignerEmail",gameDesignerEmail);
			formdata.append("gallery1Id",gallery1Id);
			formdata.append("gallery2Id",gallery2Id);
			formdata.append("gameCategory",gameCategory);
			formdata.append("oidcEmail",oidc_userinfo.email);
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
			formdata.append("connectionSrc1",connectionSrc1);
			formdata.append("connectionSrc2",connectionSrc2);
			formdata.append("connectionSrc3",connectionSrc3);
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
						var createGameMessage = $('<h2 style="color:#630303;">Game with name "'+gameName+'" is created successfully! Go to \'Edit Games\' menu to add levels to the game.</h2>');
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

		function reloadDataFromDatabase1(){
			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {
				resetGameCreationView();
			});
		}

		function reloadDataFromDatabase2(){
			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {
				resetEditGameView();
			});
		}



		function createLevel(){
			
			var eLearningLink = $.trim($('#newELearningLink')[0].value);
			var moreInformation = $.trim($('#newMoreInformationLink')[0].value);
			var gameId = $('select[name=selectgame]').val();
			var gallery1src = $('#edit'+selectGalleryTile1).find(".active").find(".imgfocus")[0].alt;
			var gallery2src = $('#edit'+selectGalleryTile2).find(".active").find(".imgfocus")[0].alt;

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
				var gallery3src = $('#edit'+selectGalleryTile3).find(".active").find(".imgfocus")[0].alt;
				formdata.append("gallery3src",gallery3src);
			}else{
				formdata.append("gallery3src","");
			}
			if(gameGallery4 != ""){
				var gallery4src = $('#edit'+selectGalleryTile4).find(".active").find(".imgfocus")[0].alt;
				formdata.append("gallery4src",gallery4src);
			}else{
				formdata.append("gallery4src","");
			}
			formdata.append("eLearningLink",eLearningLink);
			formdata.append("moreInformation",moreInformation);
			if(formdata){
				$.ajax({
					url: "lib/database/create_level.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						$('#add-level-message').text("");
						/*$('#selectedgamegallery1').find(".active").remove();
						$('#selectedgamegallery2').find(".active").remove();
						if(gameGallery3 != ""){
							$('#selectedgamegallery3').find(".active").remove();
						}
						if(gameGallery4 != ""){
							$('#selectedgamegallery4').find(".active").remove();
						}*/
						/*$('#create-level-button').find('*').prop('disabled',true);
						$('#create-level-button').find('*').addClass('ui-disabled');*/
						var createLevelMessage = $('<h2 style="color:#630303;">New Level is added to the game.</h2>');
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
				$('#moreInformationLink')[0].value = GAMELEVELS[index]["moreInformation"];	
			}
		}

		function clearSlots(){
			for(var i=0;i<NUMBER_OF_GALLERIES;i++){
				var slot = $('#editslot' + i);
				slot.children().remove();

			}
			$('#eLearningLink')[0].value = "";	
			$('#moreInformationLink')[0].value = "";
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
			
			var connWidth1 = $('#'+connectionGallery1).width();
			$('#ulwrap-'+connectionGallery1).width(connWidth1-75);
			CONNECTIONS1ul.width((102 * CONNECTIONS1ul.children().length));

			var connWidth2 = $('#'+connectionGallery2).width();
			$('#ulwrap-'+connectionGallery2).width(connWidth2-75);
			CONNECTIONS2ul.width((102 * CONNECTIONS2ul.children().length));

			var connWidth3 = $('#'+connectionGallery3).width();
			$('#ulwrap-'+connectionGallery3).width(connWidth3-75);
			CONNECTIONS3ul.width((102 * CONNECTIONS3ul.children().length));

			
			var gameGal1Width = $('#'+selectGalleryTile1).width();
			$('#ulwrap-'+selectGalleryTile1).width(gameGal1Width-75);
			GAMEGALLERY1ul.width((102 * GAMEGALLERY1ul.children().length));

			var gameGal2Width = $('#'+selectGalleryTile2).width();
			$('#ulwrap-'+selectGalleryTile2).width(gameGal2Width-75);
			GAMEGALLERY2ul.width((102 * GAMEGALLERY2ul.children().length));

			var gameGal3Width = $('#'+selectGalleryTile3).width();
			$('#ulwrap-'+selectGalleryTile3).width(gameGal3Width-75);
			GAMEGALLERY3ul.width((102 * GAMEGALLERY3ul.children().length));

			var gameGal4Width = $('#'+selectGalleryTile4).width();
			$('#ulwrap-'+selectGalleryTile4).width(gameGal4Width-75);
			GAMEGALLERY4ul.width((102 * GAMEGALLERY4ul.children().length));

			var changeConnectionWidth1 = $('#'+setConnection1).width();
			$('#ulwrap-'+setConnection1).width(changeConnectionWidth1-75);
			CHANGECONNECTION1ul.width((102 * CHANGECONNECTION1ul.children().length));

			var changeConnectionWidth2 = $('#'+setConnection2).width();
			$('#ulwrap-'+setConnection2).width(changeConnectionWidth2-75);
			CHANGECONNECTION2ul.width((102 * CHANGECONNECTION2ul.children().length));

			var changeConnectionWidth3 = $('#'+setConnection3).width();
			$('#ulwrap-'+setConnection3).width(changeConnectionWidth3-75);
			CHANGECONNECTION3ul.width((102 * CHANGECONNECTION3ul.children().length));

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