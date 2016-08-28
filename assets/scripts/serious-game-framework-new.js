//var UPLOADPATH = "uploads/";
var DEBUG = false;

// 0: very easy (only one piece left to fill)
// 1: easy (only two pieces left to fill)
// 2: medium (user chooses first piece; system gives one other piece)
// 3: hard (free game)
// 4: very hard (one random piece will be shown and the user has to pick the missing ones IMPLEMENTED
var DIFFICULTY = 3;
var NEWDIFFICULTY = 3;
var SHOWME = false;
var TRYAGAIN = false;
var HINT = false;

var GAMEID = -1;


var GAMEINDEX = -1;
var GALLERYNAMES;
var GAMELEVELS;
var NUMBER_OF_GALLERIES;
var GAMELEVELSSTATS;
var GAME_DESCRIPTION_TEXT;
var GAME_DESIGNER_NAME;
var GAME_DESIGNER_EMAIL;
var GAME_DESIGNER_INSTITUTION;

var CURRENT_GAME_BADGES;

var GOTDATA = false;
//var GAMESDATA;
//var LEVELDATA;
//var PIECESDATA;
//var CONNECTIONSDATA;
var TUTORIALSDATA;

//var INTRO = introJs();
var TUTORIAL = false;
var TUTORIALSTARTED = false;

var NEXTLEVELS = [];
var LEVELSDONE = [];
var CURRENTLEVEL = -1;
var SELECTEDITEMS = [];
var GAMESTATE = "leveldone";
var GAMEINDEX;
var GAME_BADGES_INDEX;
var CURRENT_HIGHSCORE;
var CURRENT_HIGHSCORE_DATA_INDEX;
var CORRECT_FACTOR;
var WRONG_FACTOR;
var SHOWME_FACTOR;
var TRYAGAIN_FACTOR;
var HINT_FACTOR;

// TODO MARKO add real oidc_userinfo
//var oidc_userinfo = {name: "Marko Kajzer", preferred_username: "marko.kajzer", email: "marko.kajzer@hotmail.de"};
var oidc_userinfo;
var gleaner_url = GLEANER_URL; // TODO ADD REAL LOCATION HERE

var correct = 0;
var wrong = 0;
var elearning = 0;
var moreInformation = 0;

var badge_asserter = new BadgeAsserter();
var gleaner_tracker = new GleanerTracker();
var chart_creator = new ChartCreator();

// When DOM is loaded do the following
function getGameLevelsForStats(gameId,act_type, prefix,gameIndex){
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
			GAMELEVELSSTATS = JSON.parse(data);
			chart_creator.changeChart(gameId, act_type, prefix, gameIndex);
		}
	});
}
$(document).ready(function() {
	// TODO MARKO Session Summary ALERT instead of LOG
	window.onbeforeunload = function() {
		if(correct || wrong || elearning) {
			return "Session Summary: \n" +
			"You had " + correct + " / " + (correct + wrong) + " correct answers \n" +
			"and have read " + elearning + " articles!";
		}
	}

	setGalleryHeight();

	$(window).resize(function() {
		setGalleryHeight();
	});

	if (!GOTDATA) {
		// Clean up the game board and delete everything
		$("#bodywrapper").remove();
	}

	// Hide the areas for level verification
	//$('#button-showme').hide();
	//$('#button-next').hide();
	//$('.level-verification').hide();
	//$('#elearning').hide();

	// Global variables for the galleries and the slots
	var GALLERIES = $(".gallery")
	GALLERY0 = $("#gallery0"),
	GALLERY1 = $("#gallery1"),
	GALLERY2 = $("#gallery2"),
	GALLERY3 = $("#gallery3"),
	GALLERY0ul = $("ul", GALLERY0);
	GALLERY1ul = $("ul", GALLERY1);
	GALLERY2ul = $("ul", GALLERY2);
	GALLERY3ul = $("ul", GALLERY3);
	SLOT0 = $("#slot0"),
	SLOT1 = $("#slot1"),
	SLOT2 = $("#slot2"),
	SLOT3 = $("#slot3");
		// idea: GALLERY = [$("gallery0"),...]
		
		$('#playgameslink').click(function() { 
			$('.gameslist').empty();
			$("[id^='category-']").remove();

			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {
				if(GAMESDATA != undefined && GAMESDATA.length != 0){
					if(oidc_userinfo != undefined){
						getAllGamesHighscore();
					}
					if(CURRENT_HIGHSCORE == undefined){
						CURRENT_HIGHSCORE = 0;
					}
					
					fillGamesList(GAMESDATA);
				}
			});

		});

		$(document).on('click', '.gamelink', function () {
			var gameID = $(this).attr('game-id');
			var gameIndex = $(this).attr('gameIndex');

			if(gameIndex != undefined){
				GAMEID = parseInt(gameID);
				GAMEINDEX = parseInt(gameIndex);

				GAME_DESCRIPTION_TEXT = $.trim(GAMESDATA[GAMEINDEX]["gameDescriptionText"]);
				GAME_DESIGNER_NAME = $.trim(GAMESDATA[GAMEINDEX]["gameDesignerName"]);
				GAME_DESIGNER_INSTITUTION = $.trim(GAMESDATA[GAMEINDEX]["gameDesignerInstitution"]);
				GAME_DESIGNER_EMAIL = $.trim(GAMESDATA[GAMEINDEX]["gameDesignerEmail"]);

				GAME_DESCRIPTION_TEXT = GAME_DESCRIPTION_TEXT + "\n" + "\n" + "Game Designer Name: " + GAME_DESIGNER_NAME + "\n" + "Institution: " + GAME_DESIGNER_INSTITUTION + "\n" + "Contact: " + GAME_DESIGNER_EMAIL;

				GAME_DESCRIPTION_TEXT = GAME_DESCRIPTION_TEXT.replace(/\n/g, "<br />");
				var descriptionText = $('<h4 style="text-align:justify;" >'+GAME_DESCRIPTION_TEXT+'</h4>');
				$('#descriptionTextDiv').text("");
				$('#descriptionTextDiv').append(descriptionText);
				loadGame(GAMEINDEX,GAMEID);

			}
		// Send trace for starting a game
		//gleaner_tracker.trackTrace(oidc_userinfo, "game_start",
		//	{gameID: GAMEID});
	});
		$(document).on('click', '.playGameLink', function () {
			
		// Send trace for starting a game
		gleaner_tracker.trackTrace(oidc_userinfo, "game_start",
			{gameID: GAMEID, configure : "new"});
	});
		
		/*$('.gamelink').on('click',function(){
			var gameID = $(this).attr('game-id');
			var gameIndex = $(this).attr('gameIndex');
			GAMEID = parseInt(gameID);
			GAMEINDEX = parseInt(gameIndex);
			loadGame(GAMEINDEX,GAMEID);

		// Send trace for starting a game
		gleaner_tracker.trackTrace(oidc_userinfo, "game_start",
			{gameID: GAMEID});
		});*/

		$('.options-button').click(function(){
			selectCurrentOptions();
		});

		$('#elearning').click(function() {
			elearning++;
		// Send trace for clicking an eLearning link
		gleaner_tracker.trackTrace(oidc_userinfo, "elearning",
			{gameID: GAMEID, levelID: CURRENTLEVEL, configure : "new"});
	});
		$('#moreInformation').click(function() {
			moreInformation++;
		// Send trace for clicking an eLearning link
		gleaner_tracker.trackTrace(oidc_userinfo, "moreInformation",
			{gameID: GAMEID, levelID: CURRENTLEVEL, configure : "new"});
	});

	// Functions for Player Statistics
	$('#stats-game-select').change(function(element) {
		var act_type = $('#chart-1')[0].checked ? "pie" : "bar";
		var game_index = $('option:selected', $('#stats-game-select')).attr('gameIndex');
		var game_id = $("#stats-game-select option:selected").val();
		getGameLevelsForStats(game_id,act_type,"player-",game_index);
	});
	$('#chart-1').click(function() {
		var game_index = $('option:selected', $('#stats-game-select')).attr('gameIndex');
		chart_creator.changeChart($("#stats-game-select option:selected").val(), $('#chart-1').val(),"player-", game_index);
	});
	$('#chart-2').click(function() {
		var game_index = $('option:selected', $('#stats-game-select')).attr('gameIndex');
		chart_creator.changeChart($("#stats-game-select option:selected").val(), $('#chart-2').val(),"player-", game_index);
	});

	// Functions for Designer Statistics
	$('#designer-stats-game-select').change(function(element) {
		var act_type = $('#designer-chart-1')[0].checked ? "pie" : "bar";
		chart_creator.changeChart($("#designer-stats-game-select option:selected").val(), act_type, 'designer-');
	});
	$('#designer-chart-1').click(function() {
		chart_creator.changeChart($("#designer-stats-game-select option:selected").val(), $('#designer-chart-1').val(), 'designer-');
	});
	$('#designer-chart-2').click(function() {
		chart_creator.changeChart($("#designer-stats-game-select option:selected").val(), $('#designer-chart-2').val(), 'designer-');
	});

	// Functions for Admin Statistics
	$('#admin-stats-game-select').change(function(element) {
		var act_type = $('#admin-chart-1')[0].checked ? "pie" : "bar";
		chart_creator.changeChart($("#admin-stats-game-select option:selected").val(), act_type, 'admin-');
	});
	$('#admin-chart-1').click(function() {
		chart_creator.changeChart($("#admin-stats-game-select option:selected").val(), $('#admin-chart-1').val(), 'admin-');
	});
	$('#admin-chart-2').click(function() {
		chart_creator.changeChart($("#admin-stats-game-select option:selected").val(), $('#admin-chart-2').val(), 'admin-');
	});

	$('#wrapper-showme').click(function() {
		
		if(!SHOWME){
		// Send trace for using the show_me button
		gleaner_tracker.trackTrace(oidc_userinfo, "level_completion",
			{gameID: GAMEID, levelID: CURRENTLEVEL, result: "show_me", configure : "new"});
		CURRENT_HIGHSCORE = parseFloat(CURRENT_HIGHSCORE).toFixed(2);
		CURRENT_HIGHSCORE = CURRENT_HIGHSCORE - SHOWME_FACTOR;
		$('.score').empty().append(" Highscore: "+ parseFloat(CURRENT_HIGHSCORE).toFixed(2));
	}
		showMe();
	});

	$('#wrapper-tryagain').click(function() {
		
		if(!TRYAGAIN){
		// Send trace for using the show_me button
		gleaner_tracker.trackTrace(oidc_userinfo, "level_completion",
			{gameID: GAMEID, levelID: CURRENTLEVEL, result: "try_again", configure : "new"});

		CURRENT_HIGHSCORE = parseFloat(CURRENT_HIGHSCORE).toFixed(2);
		CURRENT_HIGHSCORE = CURRENT_HIGHSCORE - TRYAGAIN_FACTOR;
		$('.score').empty().append(" Highscore: "+ parseFloat(CURRENT_HIGHSCORE).toFixed(2));
		}
		tryAgain();
	});

	$('#wrapper-hint').click(function() {
		hint();

		// Send trace for using the show_me button
		gleaner_tracker.trackTrace(oidc_userinfo, "level_completion",
			{gameID: GAMEID, levelID: CURRENTLEVEL, result: "hint", configure : "new"});
		CURRENT_HIGHSCORE = parseFloat(CURRENT_HIGHSCORE).toFixed(2);
		CURRENT_HIGHSCORE = CURRENT_HIGHSCORE - HINT_FACTOR;
		$('.score').empty().append(" Highscore: "+ parseFloat(CURRENT_HIGHSCORE).toFixed(2));
	});

	$('#wrapper-level-tutorial').click(function(){
		//if (DIFFICULTY == 3) {
		//	reverseLevel();
		//}
		startTutorial();
	});

	$('#button-down-gallery0').bind('mousedown mouseup touchstart touchend', function(event){
		if ((event.type == 'mousedown') || (event.type == 'touchstart')){
			$('#gallery0 ul').animate({"scrollTop": "+=2000px"}, 3000, 'linear');
		}else{
			$('#gallery0 ul').stop();
		}
	});

	$('#button-up-gallery0').bind('mousedown mouseup touchstart touchend', function(event){
		if ((event.type == 'mousedown') || (event.type == 'touchstart')){
			$('#gallery0 ul').animate({"scrollTop": "-=2000px"}, 3000, 'linear');
		}else{
			$('#gallery0 ul').stop();
		}
	});

	$('#button-down-gallery2').bind('mousedown mouseup touchstart touchend', function(event){
		if ((event.type == 'mousedown') || (event.type == 'touchstart')){
			$('#gallery2 ul').animate({"scrollTop": "+=2000px"}, 3000, 'linear');
		}else{
			$('#gallery2 ul').stop();
		}
	});

	$('#button-up-gallery2').bind('mousedown mouseup touchstart touchend', function(event){
		if ((event.type == 'mousedown') || (event.type == 'touchstart')){
			$('#gallery2 ul').animate({"scrollTop": "-=2000px"}, 3000, 'linear');
		}else{
			$('#gallery2 ul').stop();
		}
	});

	$('#button-right-gallery1').bind('mousedown mouseup touchstart touchend', function(event){
		if ((event.type == 'mousedown') || (event.type == 'touchstart')){
			$('#ulwrap-gallery1').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
		}else{
			$('#ulwrap-gallery1').stop();
		}
	});

	$('#button-left-gallery1').bind('mousedown mouseup touchstart touchend', function(event){
		if ((event.type == 'mousedown') || (event.type == 'touchstart')){
			$('#ulwrap-gallery1').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
		}else{
			$('#ulwrap-gallery1').stop();
		}
	});

	$('#button-right-gallery3').bind('mousedown mouseup touchstart touchend', function(event){
		if ((event.type == 'mousedown') || (event.type == 'touchstart')){
			$('#ulwrap-gallery3').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
		}else{
			$('#ulwrap-gallery3').stop();
		}
	});

	$('#button-left-gallery3').bind('mousedown mouseup touchstart touchend', function(event){
		if ((event.type == 'mousedown') || (event.type == 'touchstart')){
			$('#ulwrap-gallery3').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
		}else{
			$('#ulwrap-gallery3').stop();
		}
	});
	
	
	$('#optionsform').submit( function(e){
		e.preventDefault();
		var choice = $(this).serializeArray();
		$.each(choice, function(i, item) {
			if (item.name == "difficulty") {
				NEWDIFFICULTY = parseInt(item.value);
			}
		});
		$('.ui-dialog').dialog('close')
		return false;
	});
	
	function getGameLevels(gameId,gameIndex){
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
					loadGaleries(GAMELEVELS);
					initializeDragDrop();


					clearGameboard();
					nextLevel();

					$("#slot0" ).load(function() {
						clearGameboard();
					});

					TUTORIAL = false;
					addTutorialTexts();

					for(var i=0;i<GAME_RULES_DATA.length;i++){
						if(GAME_RULES_DATA[i].gameId == gameId){
							for(var j=0;j<GAME_BADGES.length;j++){
								if(GAME_RULES_DATA[i].gameCompletionBadgeSrc == GAME_BADGES[j].badgeSrc){
									GAME_BADGES_INDEX = j;
									break;
								}
							}
						}
						if(GAME_RULES_DATA[i].gameId == gameId){
							for(var k=0;k<HIGHSCORE_VERSIONS.length;k++){
								if(GAME_RULES_DATA[i].highscoreId == HIGHSCORE_VERSIONS[k].highscoreId){
									CURRENT_HIGHSCORE_DATA_INDEX = k;
									CORRECT_FACTOR = -parseFloat( HIGHSCORE_VERSIONS[k].correct).toFixed(2);
									WRONG_FACTOR = -parseFloat( HIGHSCORE_VERSIONS[k].wrong).toFixed(2);
									SHOWME_FACTOR = -parseFloat( HIGHSCORE_VERSIONS[k].showMe).toFixed(2);
									TRYAGAIN_FACTOR = -parseFloat( HIGHSCORE_VERSIONS[k].tryAgain).toFixed(2);
									HINT_FACTOR = -parseFloat( HIGHSCORE_VERSIONS[k].hint).toFixed(2);
									break;
								}
							}
						}
					}
				
			// Show the tutorial, if the game is marked as tutorial
			if (TUTORIAL) {
				$('#levelcontrol').fadeIn();
				$('#wrapper-level-tutorial').fadeIn();
			} else {
				$('#wrapper-level-tutorial').fadeOut();
			}
			var timer = window.setTimeout(function () { document.title = GAMESDATA[gameIndex].gameName }, 500);
		}
	});
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
		//alert("height: " + myHeight);
		var galHeight = myHeight*0.6;
		var wrapperHeight = galHeight+110;
		$('#gallery0wrapper').height(myHeight);
		$('#gallery0').height(wrapperHeight);
		$('#gallery0 ul').height(galHeight);
		
		$('#gallery2wrapper').height(myHeight);
		$('#gallery2').height(wrapperHeight);
		$('#gallery2 ul').height(galHeight);
		
		var galWidth = myWidth-280;
		$('#ulwrap-gallery1').width(galWidth-75);
		$('#ulwrap-gallery3').width(galWidth-75);
	}

	
	
	
	function selectCurrentOptions() {
		for (var i = 1; i < 5; i++) {
			if (DIFFICULTY == i) {
				$('#difficulty-choice' + i).attr('checked',"checked");
			} else {
				if ($('#difficulty-choice' + i).attr('checked')) {
					$('#difficulty-choice' + i).removeAttr('checked');
				}
			}
		}
	}
	function addToCategory(gameCategory, index, data, exists){
		var game = $('<li><a href="#gameDescriptionPage" id="game-id-'+ data.gameId + '" game-id="' + data.gameId + '" gameIndex="' + index +'" class="gamelink"><h3 style="color:#0456a2;">' + data.gameName + '</h3><p style="color:#0456a2;">' + data.gameDescription + '</p></a></li>');
		
		if(exists == "false"){

			var	$inner1 = $("<div/>" , {id:gameCategory, "data-role":"page", class:"ui-helper-clearfix bodywrapper"}),
			$inner2 = 	$("<div/>" , {"data-role":"content"}),
			$inner3 = $("<ul/>" , {id:"game-"+gameCategory, "data-role":"listview", "data-inset":"true", class:"listOfGames"});

			$inner1.append($inner2.append($inner3.append(game))).appendTo("body");	
			createHeader("Play Games",false,$inner1);
		}else{
			$('#game-'+gameCategory).append(game);
		}
	}
	function createHeader(headerName, appendFactor, elementAppend){
		
		var $inner1 = $("<div/>", {"data-role":"header", "data-theme":"b"}),
		$inner2a = $("<div>", {"data-inline":"true"}),
		$inner3a = $("<a/>", {href:"https://goo.gl/FKJDbF", target:"_blank", class:"ui-btn-right", "data-inline":"true", "data-role":"button", text:"Feedback"}),
		$inner3b = $("<a/>", {href:"#", "data-icon":"arrow-l", class:"ui-btn-left", "data-inline":"true", "data-role":"button", "data-iconpos":"notext", "data-rel":"back", text:"Home"}),
		$inner2b = $("<h2/>", {text:headerName});

		if(appendFactor){
			$inner1.append($inner2a.append($inner3a,$inner3b),$inner2b).appendTo(elementAppend);
		}else{
			$inner1.append($inner2a.append($inner3a,$inner3b),$inner2b).prependTo(elementAppend);
		}

	}
	function fillGamesList(gamesData) {
		var categoryCounter = new Array();

		if(gamesData != null){
			$.each(gamesData, function(i, data) {

				var game = "";
				if(data.gameName != "Tutorial"){

					if(data.gameCategory == null){
						data.gameCategory = "Other";
					}
					
					if(categoryCounter[data.gameCategory]){
						addToCategory("category-"+data.gameCategory,i,data,"true");
					}else{
						game = $('<li><a href="#category-'+data.gameCategory +'" class="gamelink"><h3 style="color:#0456a2;">' + data.gameCategory + '</h3><p style="color:#0456a2;">Games under ' + data.gameCategory + ' category</p></a></li>');
						addToCategory("category-"+data.gameCategory,i,data,"false");
						categoryCounter[data.gameCategory] = 1;
					}

				}else{
					game = $('<li><a href="#game" id="game-id-'+ data.gameId + '" game-id="' + data.gameId + '" gameIndex="' + i +'" class="gamelink"><h3 style="color:#0456a2;">' + data.gameName + '</h3><p style="color:#0456a2;">' + data.gameDescription + '</p></a></li>');
				}

				if(game != ""){
					if(data.gameName == "Tutorial"){
						$('.gameslist').prepend(game);
					}else{
						$('.gameslist').append(game);
					}
				}


			});

			if ( $('.gameslist').hasClass('ui-listview')) {
				$('.gameslist').listview('refresh');
			} 
			else {
				$('.gameslist').trigger('create');
			}
		//$('.gameslist').listview('refresh');
	}
}

function loadGame(gameIndex, gameID) {
	if (gameIndex > -1) {
		$('#wrapper-level-tutorial').fadeOut();
		$('#wrapper-back-main').fadeOut();
		$('#wrapper-showme').fadeOut();
		$('#wrapper-tryagain').fadeOut();
		$('#wrapper-hint').fadeOut();
		$('#wrapper-next').fadeOut();
		$('#elearning').empty();
		$('#elearning').fadeOut();
		$('#moreInformation').empty();
		$('#moreInformation').fadeOut();
		$('#leveldone').fadeOut();
		$('#levelcontrol').fadeOut();
						
		$('.gametitle').empty().append(GAMESDATA[gameIndex].gameName);
		$('.score').empty().append(" Highscore: "+ CURRENT_HIGHSCORE);
			// set the gallery and slot titles if available
			NUMBER_OF_GALLERIES = 2;
			if(GAMESDATA[gameIndex].gallery3Id != ""){
				NUMBER_OF_GALLERIES = 3;
				$('#headerslot2td').removeClass('hideElement');
				$('#hideslot2').removeClass('hideElement');
				$('#gallery2wrapper').removeClass('hideElement');
				$('#gallery2wrapper').css("display","table-cell");
				$('#connection1').css("display","block");
				$('#wrapperslot2').css("display","block");
			}else{
				$('#headerslot2td').addClass('hideElement');
				$('#hideslot2').addClass('hideElement');
				$('#gallery2wrapper').addClass('hideElement');
				$('#gallery2wrapper').css("display","none");
				$('#connection1').css("display","none");
				$('#wrapperslot2').css("display","none");
			}
			if(GAMESDATA[gameIndex].gallery4Id != ""){
				NUMBER_OF_GALLERIES = 4;
				$('#headerslot3td').removeClass('hideElement');
				$('#hideslot3').removeClass('hideElement');
				$('#gallery3wrapper').removeClass('hideElement');
				$('#connection2').css("display","block");
				$('#wrapperslot3').css("display","block");
			}else{
				$('#headerslot3td').addClass('hideElement');
				$('#hideslot3').addClass('hideElement');
				$('#gallery3wrapper').addClass('hideElement');
				$('#connection2').css("display","none");
				$('#wrapperslot3').css("display","none");
			}
			if(GALLERYNAMES != undefined || GALLERYNAMES.length != 0){
				$.each(GALLERYNAMES, function(index, value) {
					for (var i = 1; i <= NUMBER_OF_GALLERIES; i++) {
						var id="gallery"+i+"Id";
						var j = i-1;
						if(GAMESDATA[gameIndex][id]== value.galleryId){
							if(value.galleryName != i){
								$('#header-slot'+j).empty().append(value.galleryName);
								$('#header-gallery'+j).empty().append(value.galleryName);
							}else{
								$('#header-slot' + j).empty().append("Slot " + (i));
								$('#header-gallery' + j).empty().append(i);
							}
							
						}
					}

				});	
			}
			clearGalleries();
			initializeLevelState();
			getGameLevels(gameID,gameIndex);
		}
	}
	
	function startTutorial() {
		introJs().start();
		$('#wrapper-showme').fadeIn();
		$('#button-showme').show();
		$('#wrapper-tryagain').fadeIn();
		$('#button-tryagain').show();
		$('#wrapper-hint').fadeIn();
		$('#button-hint').show();
		$('#elearning').empty();
		$('#elearning').fadeIn();
		$('#elearning').append('<a href="' + GAMELEVELS[0]["eLearningLink"] + '" target="_blank">E-Learning Link</a>');
		$('#moreInformation').empty();
		$('#moreInformation').fadeIn();
		$('#moreInformation').append('<a href="' + GAMELEVELS[0]["moreInformation"] + '" target="_blank">More Information Link</a>');
		TUTORIALSTARTED = true;
	}
	
	function addTutorialTexts() {
		//var tutorialSteps;
		if(TUTORIALSDATA != null){
			$.each(TUTORIALSDATA, function(i, data) {
			// i: Tutorial ID
			// data: Tutorial data
			if (data.game == GAMESDATA[GAMEINDEX].gameName) {
				TUTORIAL = true;
				$.each(data.tutorials, function(j, tutData) {
					// j: data-step
					// tutData.identifier: A jQuery identifier where the tutorial text should be added
					// tutData.text: Tutorial Text of this step
					// tutData.position: Position of the tutorial text
					var area = $(tutData.identifier);
					if(j == 3){
						area = $('img', '#gallery0 ul');
					}else if(j == 5){
						area = $('img', '#gallery1 ul');
					}else if(j == 7){
						area = $('img', '#gallery2 ul');
					}else if(j == 8){
						area = $('img', '#gallery3 ul');
					}
					
					area.attr( "data-step", j );
					area.attr( "data-intro", tutData.text );
					area.attr( "data-position", tutData.position );
					
					//var entry = newObject();
					//entry.element = tutData.identifier;
					//entry.
				});
				introJs().start();
				// timeouts are neccessary because the first introJS popup shows in the upper left corner when initiated from a function and not from a button
				var timeout = window.setTimeout(function () { introJs().exit() }, 500);
				var timeout = window.setTimeout(function () { startTutorial(); }, 1000);
				
			}
		});
		}
	}

	function initializeLevelState() {
		NEXTLEVELS = [];
		LEVELSDONE = [];
		CURRENTLEVEL = -1;
		GAMESTATE = "leveldone";
	}

	function clearGameboard() {
		unblockAllSlots();
		for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
			var piece = $('li', '#slot' + i);
			var remove = function(p){
				p.remove();
			}(piece);
		}
	}

	function clearGalleries() {
		for (var i=0; i < NUMBER_OF_GALLERIES; i++) {
			var clear = function(j) {
				$('ul', "#gallery" + j).empty();
			}(i);
		}
	}

	/**
	  * Fills the four galleries with data
	  * @param gameID The ID of the current game.
	  */
	  function loadGaleries( gameLevels ) {
	  	if(gameLevels != null){
	  		var pieceCounter = new Array();
	  		$.each(gameLevels, function(index, value) {
	  			rand(0,1) ? NEXTLEVELS.push(parseInt(index)) : NEXTLEVELS.unshift(parseInt(index));

	  			for(var i=0;i<NUMBER_OF_GALLERIES;i++){
	  				var j = i+1;
	  				var id= "gallery"+j+"src";
	  				var p= value[id];
	  				var distinct = p+j;
	  				if (pieceCounter[distinct]) {
	  					pieceCounter[distinct]++;
	  					$('img[piece-id="' + p + '"]', '#gallery' + i + ' ul').attr('piece-count',pieceCounter[distinct]);

	  				} else {
	  					var image = $('<li class="ui-widget-content ui-corner-tr piece" draggable="true"><img src="' + TILES_CONNECTIONS_PATH + p + '" alt="' +  p + '" width="94" height="68" id="piece-id-'+i+'" piece-id="' + p + '" piece-count="1"/></li>');
	  					rand(0,1) ? $('#gallery' + i + ' ul').prepend(image) : $('#gallery' + i + ' ul').append(image);
	  					pieceCounter[distinct] = 1;
	  				}

	  			}
	  		});

	  		setGalleryWidth();
	  	}
	  }

	  function setGalleryWidth() {
	  	GALLERY3ul.width((102 * GALLERY3ul.children().length));
	  	GALLERY1ul.width((102 * GALLERY1ul.children().length));
	  }

	/**
	  * Returns a random number in the interval [min,max]
	  * @param min Minimum value of the interval.
	  * @param max Maximum value of the interval.
	  */
	  function rand(min, max) {
	  	if (!DEBUG) {
	  		return Math.floor(Math.random() * (max - min + 1)) + min;
	  	} else {
			// disable random value for debugging
			return min;
		}
	}

	function initializeDragDrop() {
		makeGalleriesDraggable();
		makeSlotsDroppable(NUMBER_OF_GALLERIES);
		makeGalleriesDroppable(NUMBER_OF_GALLERIES);
	}
	
	// let the galleries items be draggable
	function makeGalleriesDraggable() {
		$( "li", GALLERIES ).draggable({
			revert: "invalid", // when not dropped, the item will revert back to its initial position
			containment: "document",
			helper: "clone",
			cursor: "move",
			appendTo: "body",
			scroll: false
		});
	}
	
	
	// let the slots be droppable, accepting the connected gallery items
	function makeSlotsDroppable(number) {
		for (var i=0; i < number; i++) {
			var move = function(j) {
				$("#slot" + j).droppable({
					accept: "#gallery" + j + " li",
					activeClass: "ui-state-highlight",
					drop: function( event, ui ) {
						movePieceToSlot( ui.draggable, j, j );
					}
				});
			}(i);
		}
	}

	// let the galleries be droppable as well, accepting items from the game board
	function makeGalleriesDroppable(number) {
		for (var i=0; i < number; i++) {
			var move = function(j) {
				$("#gallery" + j).droppable({
					accept: "#slot" + j + " li",
					activeClass: "custom-state-active",
					drop: function( event, ui ) {
						movePieceToGallery( ui.draggable, j );
					}
				});
			}(i);
		}
	}
	
	/** 
	  * This function moves a piece from the gallery to a given slot.
	  * @param piece The piece that should be moved.
	  * @param slotID The ID of the slot where the piece should be moved.
	  * @param galleryID The ID of the gallery where the piece should be deleted.
	  */
	  function movePieceToSlot( piece, slotID, galleryID ) {
		//alert(slotID + " - " + galleryID);
		var slot = $('#slot' + slotID);
		var gallery = $('#gallery' + galleryID);
		var list = $( "li", slot );
		addToSelectedItems(piece, slotID);
		if (!list.length) {
			piece.fadeOut(function() {
				piece.appendTo( slot ).fadeIn(verifyLevel());
			});
		} else {
			deleteFromSelectedItems(list, slotID)
			list.fadeOut(function() {
				list.appendTo( $("ul",gallery) ).fadeIn(verifyLevel());
			});
			piece.fadeOut(function() {
				piece.appendTo( slot ).fadeIn(verifyLevel());
			});
		}
		// the following does not work, as resuming the intro is not possible
		//if (TUTORIALSTARTED) {
		//	var pieceStep = $("img", piece).attr('data-step');
		//	var slotStep = $(slot).attr('data-step');
		//	if ((pieceStep) && (slotStep)) {
		//		alert(pieceStep + " - " + slotStep);
		//		introJs().setOption('tooltipClass', 'customDefault').start(3);
		//	}
		//}
	}
	
	function addToSelectedItems(piece, slotID) {
		var pieceID = $("img", piece).attr('piece-id');
		//var arrEntry = new Object();
		//arrEntry["piece"] = pieceID;
		//arrEntry["slot"] = slotID;
		var arrEntry = [pieceID, slotID];
		SELECTEDITEMS.push(arrEntry);
	}
	
	function deleteFromSelectedItems(piece, slotID) {
		var pieceID = $("img", piece).attr('piece-id');
		//var arrEntry = new Object();
		//arrEntry["piece"] = pieceID;
		//arrEntry["slot"] = slotID;
		var arrEntry = [pieceID, slotID];
		var arrIndex = -1;
		for (var i=0; i<SELECTEDITEMS.length; i++) {
			if ((SELECTEDITEMS[i][0] == pieceID) && (SELECTEDITEMS[i][1] == slotID)) {
				arrIndex = i;
				break;
			}
		}
		SELECTEDITEMS.splice(arrIndex, 1);
	}
	
	/** 
	  * This function moves a pieces from a slot back to the gallery.
	  * @param piece The piece that should be moved.
	  * @param galleryID The ID of the gallery where the piece should be dropped.
	  */
	  function movePieceToGallery( piece, slotID ) {
	  	var gallery = $('#gallery' + slotID);

	  	deleteFromSelectedItems(piece, slotID);

	  	piece.fadeOut(function() {
	  		piece.appendTo( $("ul", gallery) ).fadeIn();
	  		verifyLevel();
	  	});
	  }


	// maybe not used
	function swapPieces( piece1, piece2, slotID ) {
		var slot = $('#slot' + slotID);
		var gallery = $('#gallery' + slotID);
		var list = $( "li", slot );
		
		
		if (list.length) {
			if (list == piece1) {
				
			}
		}
		
		piece.fadeOut(function() {
			piece.appendTo( $("ul", gallery) ).fadeIn();
		});
	}
	
	function blockPiece(piece) {
		//var pID = $('img', piece).attr('piece-id');
		//alert("blockPiece: " + pID);
		
		//slot.droppable( "option", "disabled", true );
		//$('li', slot).draggable( "disable" );
		
		//var gallery = $('#gallery' + slotID);
		//$('li', gallery).droppable( "disable" );
		
		piece.draggable( "disable" );
		piece.fadeTo(0, 1);
		piece.css('opacity','1');
	}
	
	function unblockPiece(piece) {
		//var pID = $('img', piece).attr('piece-id');
		//alert("unblockPiece: " + pID);
		
		piece.draggable( "enable" );
		piece.css('opacity','1');
	}
	
	function blockSlot(slot, option) {
		//alert("blockSlot: " + slot.attr('id') + " - " + option);
		
		slot.droppable( "disable" );
		slot.css('opacity','1');
		slot.fadeTo(0, 1);		// Fixes that the opacity would be lowered here
		if (option == true) {
			slot.removeClass("ui-droppable ui-state-default ui-droppable-disabled ui-state-disabled").addClass("slot-blocked");
		} else {
			slot.removeClass("ui-droppable ui-state-default ui-droppable-disabled ui-state-disabled").addClass("slot-disabled");
		}
	}
	
	function unblockSlot(slot) {
		//alert("unblockSlot: " + slot.attr('id'));
		
		slot.removeClass("slot-blocked slot-disabled").addClass("ui-state-default ui-droppable ui-widget-content");
		slot.droppable();
		slot.droppable( "enable" );
	}
	
	function unblockAllSlots() {
		for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
			var slot = $('#slot' + i);
			var unblock = function(s) {
				//alert("unblock: " + s.attr('id'));
				unblockSlot(s);
				setSlotColor(s, "none");
			}(slot);
		}
	}
	
	function setSlotColor(slot, color) {
		//alert("setColor: " + slot.attr('id') + " - " + color);
		
		switch (color) {
			case "green":
			slot.removeClass("ui-droppable ui-state-default ui-droppable-disabled ui-state-disabled ui-widget-content slot-blocked").addClass("slot-green");
			break;
			case "red":
			slot.removeClass("ui-droppable ui-state-default ui-droppable-disabled ui-state-disabled ui-widget-content slot-blocked").addClass("slot-red");
			break;
			default:
			slot.removeClass("slot-red slot-green").addClass("ui-state-default ui-widget-content");
			break;
		}
	}
	
	function getCurrentLevel() {
		var res = CURRENTLEVEL;
		switch (DIFFICULTY) {
			case 0:
			case 1:
			case 4:
			break;
			case 3:

			default:
				// if != currentlevel : updateConnections()
				var tmpres = findBestFittingLevels();
				//alert(tmpres);
			//	if (tmpres.length == 1) {
				res = tmpres[0];
				//} else {
				//	res = -1;
				//}
				break;
			}
			CURRENTLEVEL = res;
			return res;
		}

	// Basically to transform the SELECTEDITEMS array into an array with the following subsets:
	// Example: SELECTEDITEMS = [ Object{piece=10, slot=1}, Object{piece=34, slot=3}, Object{piece=2, slot=0}]
	// Example result: res = [ [Object{piece=10, slot=1}], [Object{piece=10, slot=1}, Object{piece=34, slot=3}], Object{piece=10, slot=1}, Object{piece=34, slot=3}, Object{piece=2, slot=0} ]
	function createSubSets(arr) {
		var res = [];
		for (var i=1; i<=arr.length; i++) {
			
			var tmp = arr.slice();
			var set = tmp.splice(0,i);
			//alert(set);
			res.push(set);
			
			
		}
		return res;
	}
	
	// Finds the best fitting Levels for the selected Items
	function findBestFittingLevels() {
		var oldLevel = CURRENTLEVEL;
		
		var subSets = createSubSets(SELECTEDITEMS);
		
		//alert(JSON.stringify(subSets));
		
		var bestFittingLevels = [];
		
		for (var i=0; i < subSets.length; i++) {
			var tmpFittingLevels = [];
			
			//$.each(LEVELDATA, function(j, data) {
				// i: levelID
				// data: level data
				for (var j=0; j < NEXTLEVELS.length; j++) {
				// NEXTLEVELS[j]: LevelID of one next level
				var levelID = parseInt(NEXTLEVELS[j]);
				
				var levelfits = true;
				
				for (var k=0; k < subSets[i].length; k++) {
					// Hier sind nun die einzelnen gewählten Pieces des Subsets
					var tmpPieceID = subSets[i][k][0];
					var tmpSlotID = subSets[i][k][1];
					
					if (GAMELEVELS[levelID].gameId == GAMEID) {
						var m = tmpSlotID + 1;
						var id= "gallery"+m+"src";
						if (GAMELEVELS[levelID][id] != tmpPieceID) {
							levelfits = false;
						}
					} else {
						levelfits = false;
					}
				}
				if (levelfits) {
					tmpFittingLevels.push(levelID);
				}
			}
			
			//alert("bei " + subSets[i] + " passende Level: " + tmpFittingLevels);
			
			if (tmpFittingLevels.length) {
				bestFittingLevels = tmpFittingLevels.slice();
			}
		}
		
		//alert("gesamt passende level: " + bestFittingLevels);
		
		return bestFittingLevels;
	}
	
	function findBestFittingLevel2() {
		var oldLevel = CURRENTLEVEL;
		
		var p = [];
		for(var i=0;i<NUMBER_OF_GALLERIES;i++){
			p[i] = $("img", "#slot"+i).attr('piece-id');
		}
		
		//alert(p[0]);
		var oldMatching = 0;
		
		if (oldLevel > -1) {
			for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
				var j = i + 1;
				var id= "gallery"+j+"src";
				if (GAMELEVELS[oldLevel][id] == p[i]) {
					oldMatching++;
				}
			}
		}
		
		var bestMatching = oldMatching;
		var bestFittingLevel = oldLevel;
		
		//alert("oldMatching: " + bestMatching);
		if(GAMELEVELS != null){
			$.each(GAMELEVELS, function(j, data) {
			// i: levelID
			// data: level data
			if (data.game_id == GAMEID) {
				var tmpMatching = 0;
				for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
					var k = i + 1;
					var id= "gallery"+k+"src";
					if (GAMELEVELS[j][id] == p[i]) {
						tmpMatching++;
					}
				}
				if (tmpMatching > bestMatching) {
					bestMatching = tmpMatching;
					bestFittingLevel = j;
					//alert("betterMatching: " + bestMatching + " Level: " + bestFittingLevel);
				}
			}
		});
		}
		if (bestMatching == 0) {
			bestFittingLevel = -1;
		}
		
		//alert("Results: bestMatching: " + bestMatching + " bestLevel: " + bestFittingLevel);
		
		// needs to be implemented
		// searches the best fitting level on the given user input
		//alert(j);
		return bestFittingLevel;
	}
	
	function nextLevel() {
		if (GAMESTATE == "leveldone") {
			GAMESTATE = "starting";
			// 0: very easy (only one piece left to fill)
			// 1: easy (only two pieces left to fill)
			// 2: medium (user chooses first piece; system gives one other piece)
			// 3: hard (free game)
			// 4: very hard (one random piece will be shown and the user has to pick the missing ones
			
			// Remove green and red markers on slots
			
			
			$('#wrapper-showme').fadeOut();
			$('#wrapper-tryagain').fadeOut();
			$('#wrapper-hint').fadeOut();
			$('#wrapper-next').fadeOut();
			$('.level-verification').fadeOut();
			$('#elearning').fadeOut().empty();
			$('#moreInformation').fadeOut().empty();
			$('#wrapper-level-tutorial').fadeOut();
			$('#levelcontrol').fadeOut();
			
			
			for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
				var slot = $('#slot' + i);
				var piece = $('li', '#slot' + i);
				var move = function(j, p){
					var count = $('img', p).attr('piece-count');
					if (count > 1) {
						$('img', p).attr('piece-count', count-1);
						movePieceToGallery( p, j );
						unblockPiece(p);
					} else {
						p.remove();
					}
				}(i, piece);
				
			}
			
			unblockAllSlots();
			
			clearConnections();
			
			//alert("new: " + NEWDIFFICULTY + ", old: " + DIFFICULTY);
			if (NEWDIFFICULTY != DIFFICULTY) {
				if (NEWDIFFICULTY > -1) {
					DIFFICULTY = NEWDIFFICULTY;
				}
			}
			
			SELECTEDITEMS = [];
			
			SHOWME = false;
			TRYAGAIN = false;
			HINT = false;
			
			//alert(DIFFICULTY);
			switch (DIFFICULTY) {
				case 0:
				break;
				case 1:
				break;
				case 4:
				if (NEXTLEVELS.length) {
					CURRENTLEVEL = NEXTLEVELS.pop();
					var slotID;
					var pieceID;
					do {
						slotID = rand(0,3);
						var k = slotID + 1;
						var id= "gallery"+k+"src";
						pieceID = GAMELEVELS[CURRENTLEVEL][id];
							//alert(CURRENTLEVEL + " - " + slotID + " - " + pieceID);
						} while (pieceID < 0);
						
						var slot =  $('#slot' + slotID);
						var gallery = $('#gallery' + slotID);
						var list = $( "li", slot );
						var piece = $('img[piece-id="' + pieceID + '"]', '#gallery' + slotID + ' ul').parent();
						
						movePieceToSlot( piece, slotID, slotID )
						//alert("blockSlot2: " + slot.attr('id'));
						blockSlot(slot, true);
						//var pID = $('img', piece).attr('piece-id');
						//alert("blockPiece2: " + pID);
						blockPiece(piece);
						
						blockUnusedSlots();
						
						setConnections();
						
					} else {
						// do something when no more level available
					}
					break;
					default:
					break;
				}
				setGalleryWidth();
				GAMESTATE = "playing";
			}
		}

		function clearConnections() {
			var number_of_connections = NUMBER_OF_GALLERIES - 1;
			for (var i = 0; i <number_of_connections; i++) {
				$('#connection' + i).empty();
			}
		}

		function setConnections() {
			var number_of_connections = NUMBER_OF_GALLERIES - 1;
			if (CURRENTLEVEL > -1) {
				for (var i = 0; i < number_of_connections; i++) {
					//var c = GAMELEVELS[CURRENTLEVEL].connections[i];
					c = i;
					k = i+1;
					var id= "connection"+k+"Id";
				//alert(c);
				if (c > -1) {
					var connection = $('<img src="' + TILES_CONNECTIONS_PATH + GAMESDATA[GAMEINDEX][id]+ '" alt="' + GAMESDATA[GAMEINDEX][id] + '" width="32" height="32" connection-id="' + c + '" />');
					$('#connection' + i).append(connection);
				}
			}
		}
	}
	
	function blockUnusedSlots() {
		if (CURRENTLEVEL > -1) {
			for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
				var k = i + 1;
				var id= "gallery"+k+"src";
				if (GAMELEVELS[CURRENTLEVEL][id] < 0) {
					var block = function(j){
						//alert("blockSlot3: Slot" + j);
						blockSlot($('#slot' + j), true);
					}(i);
				}
			}
		}
	}
	
	function moveUnfittingPiecesBack() {
		if (CURRENTLEVEL > -1) {
			for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
				var k = i + 1;
				var id= "gallery"+k+"src";
				if (GAMELEVELS[CURRENTLEVEL][id] < 0) {
					var piece = $('li', '#slot' + i);
					if (piece.length) {
						var move = function(j, p){
							movePieceToGallery( p, j );
							unblockPiece(p);
						}(i, piece);
					}
				}
			}
		}
	}
	
	/** 
	  * This function verifies the current level. For this it first calls the function allSlotsFilled() to check whether all slots are filled.
	  */
	  function verifyLevel() {
	  	oldLevel = CURRENTLEVEL;
	  	setGalleryWidth();
	  	if (GAMESTATE == "playing") {
	  		var l = getCurrentLevel();

	  		if (l != oldLevel) {
	  			clearConnections();
	  			setConnections();
	  			unblockAllSlots();
	  			blockUnusedSlots();
				//move Pieces that are now on blocked slots back to the galleries:
				moveUnfittingPiecesBack();
			}
			if (l > -1) {
				
				if (SHOWME) {
					GAMESTATE = "leveldone";
					logLevel(l, "revealed");
					$('#wrapper-showme').fadeOut();
					$('#levelcontrol').fadeIn();
					$('#level-verification-revealed').show();
					$('#level-verification-wrong').hide();
					$('#elearning').empty();
					$('#elearning').fadeIn();
					if (GAMELEVELS[l]["eLearningLink"]) {
						$('#elearning').append('<a href="' + GAMELEVELS[l]["eLearningLink"] + '" target="_blank">E-Learning Link</a>');
					}
					$('#moreInformation').empty();
					$('#moreInformation').fadeIn();
					if (GAMELEVELS[l]["moreInformation"]) {
						$('#moreInformation').append('<a href="' + GAMELEVELS[l]["moreInformation"] + '" target="_blank">More Information Link</a>');
					}

					GAMESTATE = "leveldone";

					$('#wrapper-level-tutorial').fadeOut();

					var levelIndex = $.inArray(l,NEXTLEVELS);
					NEXTLEVELS.splice(levelIndex, 1);

					// Check if all levels completed
					if (!NEXTLEVELS.length) {
						$('#leveldone').fadeIn();
						$('#leveldone').empty().append('All levels done.');
						$('#wrapper-back-main').fadeIn();
					} else {
						$('#wrapper-next').fadeIn();
						$('#wrapper-next').click(function() {
							nextLevel();
						});
					}
				} else {
					$('#levelcontrol').fadeIn();
					$('#wrapper-showme').fadeIn();
					//$('#button-showme').fadeIn();
					
					//alert("returned: " + l + " old: " + oldLevel + " current: " + CURRENTLEVEL);
					// old idea: verify images on source
					//var src1 = $("img", slot0).attr('src').replace(UPLOADPATH,'');
					//var src2 = $("img", slot1).attr('src').replace(UPLOADPATH,'');
					//var src3 = $("img", slot2).attr('src').replace(UPLOADPATH,'');
					//var src4 = $("img", slot3).attr('src').replace(UPLOADPATH,'');
					
					// Store the index of the pieces in variables
					var p = [];
					for(var i=0;i<NUMBER_OF_GALLERIES;i++){
						p[i] = $("img", "#slot"+i).attr('piece-id');
					}
					
					//if (typeof p3 == 'undefined') {
					//alert("Antwort: " + p0 + ", " + p1 + ", " + p2 + ", " + p3);
					//}
					
					var correct = false;
					var levelStructure = true;
					
					for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
						var j = i + 1;
						var id= "gallery"+j+"src";
						if ((GAMELEVELS[l][id] != "") != (p[i] != undefined)) {
							levelStructure = false;
						}
					}
					
					
					if (levelStructure) {
						//alert("Structure OK");
						var check = "true";
						for(var i=0;i<NUMBER_OF_GALLERIES;i++){
							var j = i + 1;
							var id= "gallery"+j+"src";
							if(!(GAMELEVELS[l][id]== p[i]) || (GAMELEVELS[l][id] == "")){
								check = "false";
							}
						}
						if ( check == "true" ) {
							correct = true;
						}

						GAMESTATE = "leveldone";
						$('#wrapper-level-tutorial').fadeOut();
						$('#wrapper-showme').fadeOut();
						$('#wrapper-level-tutorial').fadeOut();
						$('#elearning').empty();
						$('#elearning').fadeIn();
						if (GAMELEVELS[l]["eLearningLink"]) {
							$('#elearning').append('<a href="' + GAMELEVELS[l]["eLearningLink"] + '" target="_blank">E-Learning Link</a>');
						}
						$('#moreInformation').empty();
						$('#moreInformation').fadeIn();
						if (GAMELEVELS[l]["moreInformation"]) {
							$('#moreInformation').append('<a href="' + GAMELEVELS[l]["moreInformation"] + '" target="_blank">More Information Link</a>');
						}

						if (!correct) {
							logLevel(l, "wrong");
							// Tell the user that the solution is wrong
							$('#level-verification-wrong').show();
							$('#wrapper-hint').fadeOut();

							// Send traces with result = "wrong", do not track in Tutorial
							if(!TUTORIAL) {
								$('#wrapper-tryagain').fadeIn();
								if(!TRYAGAIN){
								wrong++;
								gleaner_tracker.trackTrace(oidc_userinfo, "level_completion",
									{gameID: GAMEID, levelID: CURRENTLEVEL, result: "wrong", configure : "new"});
								CURRENT_HIGHSCORE = parseFloat(CURRENT_HIGHSCORE).toFixed(2);
								CURRENT_HIGHSCORE = CURRENT_HIGHSCORE - WRONG_FACTOR;
								$('.score').empty().append(" Highscore: "+ parseFloat(CURRENT_HIGHSCORE).toFixed(2));
							}
							}
						} else {
							logLevel(l, "correct");
							// Tell the user that the solution is correct
							$('#wrapper-tryagain').fadeOut();
							if(!HINT){
								$('#level-verification-correct').show();
							}
							$('#level-verification-wrong').hide();
							$('#wrapper-hint').fadeOut();

							// Send traces with result = "correct", do not track in Tutorial
							if(!TUTORIAL && !TRYAGAIN) {
								correct++;
								gleaner_tracker.trackTrace(oidc_userinfo, "level_completion",
									{gameID: GAMEID, levelID: CURRENTLEVEL, result: "correct", configure : "new"});
								CURRENT_HIGHSCORE = parseFloat(CURRENT_HIGHSCORE).toFixed(2);
								CURRENT_HIGHSCORE = CURRENT_HIGHSCORE - CORRECT_FACTOR;
								$('.score').empty().append(" Highscore: "+ parseFloat(CURRENT_HIGHSCORE).toFixed(2));
							}
						}
						for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
							var slot = $('#slot' + i);
							var j = i + 1;
							var id= "gallery"+j+"src";
							if (GAMELEVELS[l][id] != "") {
								if (!slot.hasClass('slot-blocked')) {
									if (GAMELEVELS[l][id] == p[i]) {
										setSlotColor(slot,"green");
									} else {
										setSlotColor(slot,"red");
									}
								}
							}
							var slotPieceID = $('img', slot).attr('piece-id');
							if (slotPieceID) {
								var piece = $('img[piece-id="' + slotPieceID + '"]', slot).parent().attr("testattr","hier");
								piece.css("opacity","1");
								var block = function(p) {
									blockPiece(p);
								}(piece);
								
							}
							blockSlot(slot,false);
						}
						
						var levelIndex = $.inArray(l,NEXTLEVELS);
						NEXTLEVELS.splice(levelIndex, 1);
						
						
						if (!correct) {
							$('#wrapper-showme').fadeIn();
							// ToDo: no timeOut, but show Show Me Button!
							// timeoutID = window.setTimeout(function(){showCorrectSolution(correct)}, 2000);
						}

						// Check if all levels completed
						if (!NEXTLEVELS.length)
						{

							for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
								var piece = $('li', '#slot' + i);
								if (piece.length) {
									piece.css("opacity","1");
								}
							}	
							$('#leveldone').fadeIn();
							$('#leveldone').empty().append('All levels done.');
							$('#wrapper-back-main').fadeIn();

							// here all levels have been completed -> award badge of this game
							var game_name = GAMESDATA[GAMEINDEX].gameName.toLowerCase();
							// console.log(game_name);
							this.badge_asserter.assertBadgeConfigured(game_name, oidc_userinfo, GAME_BADGES[GAME_BADGES_INDEX].badgeName, GAME_BADGES[GAME_BADGES_INDEX].badgeSrc);
						}
						else
						{
							if (correct) {
								$('#wrapper-next').fadeIn();
								$('#wrapper-next').click(function() {
									nextLevel();
								});
							}
						}

						// next level should be started with a button!
						// user input should be displayed with marked what was right and what wrong, then the correct solution

						setGalleryWidth();

						if (TUTORIAL) {
							var timer = window.setTimeout(function () { window.history.back() }, 5000);
						}
					} else {
						//alert("Structure nicht OK");
					}
				}

			} else {
				//$('#button-showme').fadeOut();
				$('#wrapper-showme').fadeOut();
			}
		}
	}

	function showCorrectSolution(correct) {
		var l = getCurrentLevel();
		if (l > -1) {
			for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
				var slot = $('#slot' + i);
				var piece = $('li', '#slot' + i);
				if (slot.hasClass('slot-red')) {
					var move = function(j, level, p, s){
						movePieceToGallery( p, j );
						unblockPiece(p);
						var k = j + 1;
						var id= "gallery"+k+"src";
						pieceID = GAMELEVELS[level][id];
						var piece2 = $('img[piece-id="' + pieceID + '"]', '#gallery' + j + ' ul').parent();
						movePieceToSlot( piece2, j, j );
						blockSlot(s, false);
						blockPiece(piece2);
					}(i, l, piece, slot);
				}
			}
		}

		if (!correct) {
			$('#wrapper-next').fadeIn();
			$('#wrapper-next').click(function() {
				nextLevel();
			});
		}
		setGalleryWidth();
	}

	function showMe() {
		//alert("function called");
		$('#wrapper-showme').fadeOut();
		$('#wrapper-tryagain').fadeOut();
		$('#wrapper-hint').fadeOut();
		$('#level-verification-revealed').show();
		$('#level-verification-wrong').hide();
		var l = CURRENTLEVEL;
		
		var selected = [];
		for(var i=0;i<NUMBER_OF_GALLERIES;i++){
			selected[i] = $("img", "#slot"+i).attr('piece-id');
		}
		
		if (l > -1) {
			//alert("level > -1");
			SHOWME = true;
			for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
				var slot = $('#slot' + i);
				var piece = $('li', '#slot' + i);
				blockPiece(piece);
				var k = i + 1;
				var id= "gallery"+k+"src";
				if (GAMELEVELS[l][id] != "") {
					if (!slot.hasClass('slot-blocked')) {
						if (GAMELEVELS[l][id] == selected[i]) {
							setSlotColor(slot,"green");
							//alert("piece in slot" + i + " is now green");
						} else {
							setSlotColor(slot,"red");
							//alert("piece in slot" + i + " is now red");
						}
					} else {
						//alert("piece in slot" + i + " was blocked");
					}
				}
				if (slot.hasClass('slot-red')) {
					var move = function(j, level, p, s){
						//unblockSlot(s);
						if (selected[i] != "") {
							movePieceToGallery( p, j );
						}
						unblockPiece(p);
						var k = j + 1;
						var id= "gallery"+k+"src";
						pieceID = GAMELEVELS[level][id];
						//pieceID = LEVELDATA[level].pieces[j];
						var piece2 = $('img[piece-id="' + pieceID + '"]', '#gallery' + j + ' ul').parent();
						movePieceToSlot( piece2, j, j );
						blockSlot(s, false);
						blockPiece(piece2);
					}(i, l, piece, slot);
				} else if (slot.hasClass('slot-green')) {
					blockSlot(slot,false);
				}
			}
		}
		if (GAMESTATE == "leveldone") {
			if (NEXTLEVELS.length) {
				$('#wrapper-next').fadeIn();
				$('#wrapper-next').click(function() {
					nextLevel();
				});
			}
		}
	}
	
	function tryAgain() {
		$('#wrapper-tryagain').fadeOut();
		$('#level-verification-wrong').hide();
		$('#wrapper-hint').fadeIn();

		var l = CURRENTLEVEL;
		
		var selected = [];
		for(var i=0;i<NUMBER_OF_GALLERIES;i++){
			selected[i] = $("img", "#slot"+i).attr('piece-id');
		}

		if (CURRENTLEVEL > -1) {
			if ($.inArray(CURRENTLEVEL,NEXTLEVELS) < 0) {
				NEXTLEVELS.splice(CURRENTLEVEL,0,CURRENTLEVEL);
			}
		}
		
		if (l > -1) {
			//alert("level > -1");
			TRYAGAIN = true;
			for (var i = 0; i < NUMBER_OF_GALLERIES; i++) {
				var slot = $('#slot' + i);
				var piece = $('li', '#slot' + i);
			//	blockPiece(piece);
			var k = i + 1;
			var id= "gallery"+k+"src";

			if (slot.hasClass('slot-red')) {
				var move = function(j, level, p, s){

					if (selected[i] != "") {
						movePieceToGallery( p, j );
					}
					unblockPiece(p);
					unblockSlot(slot);
					setSlotColor(slot,"none");

				}(i, l, piece, slot);
			} else if (slot.hasClass('slot-green')) {
				blockSlot(slot,false);
			}
		}
	}
	GAMESTATE = "playing";

}

function hint(){

	var l = CURRENTLEVEL;

	var selected = [];
	var correct = true;
	for(var i=0;i<NUMBER_OF_GALLERIES;i++){
		selected[i] = $("img", "#slot"+i).attr('piece-id');
	}

	if (l > -1) {
			//alert("level > -1");
			HINT = true;
			for (var i = 0; i < NUMBER_OF_GALLERIES && correct; i++) {
				var slot = $('#slot' + i);
				var piece = $('li', '#slot' + i);
				blockPiece(piece);
				var k = i + 1;
				var id= "gallery"+k+"src";
				if (GAMELEVELS[l][id] != "") {
					if (!slot.hasClass('slot-blocked')) {
						if (GAMELEVELS[l][id] == selected[i]) {
							setSlotColor(slot,"green");
							//alert("piece in slot" + i + " is now green");
						} else {
							setSlotColor(slot,"red");
							correct = false;
							//alert("piece in slot" + i + " is now red");
						}
					} else {
						//alert("piece in slot" + i + " was blocked");
					}
				}
				if (slot.hasClass('slot-red')) {
					var move = function(j, level, p, s){
						//unblockSlot(s);
						if (selected[i] != "") {
							movePieceToGallery( p, j );
						}
						unblockPiece(p);
						var k = j + 1;
						var id= "gallery"+k+"src";
						pieceID = GAMELEVELS[level][id];
						//pieceID = LEVELDATA[level].pieces[j];
						var piece2 = $('img[piece-id="' + pieceID + '"]', '#gallery' + j + ' ul').parent();
						movePieceToSlot( piece2, j, j );
						blockSlot(s, false);
						blockPiece(piece2);
						setSlotColor(slot,"none");
						setSlotColor(slot,"green");
					}(i, l, piece, slot);
				} else if (slot.hasClass('slot-green')) {
					blockSlot(slot,false);
				}
			}
		}
		if (correct) {
			GAMESTATE = "leveldone";
			$('#wrapper-hint').fadeOut();
			if (NEXTLEVELS.length) {
				$('#wrapper-next').fadeIn();
				$('#wrapper-next').click(function() {
					nextLevel();
				});
			}
		}


	}
	/**
	  * Returns true if all slots are filled.
	  * NOT REALLY NEEDED ANYMORE
	  */
	  function allSlotsFilled() {
	  	var check = "true";
	  	for(var i=0;i<NUMBER_OF_GALLERIES;i++){
	  		if(!($("li", "#slot"+i).length)){
	  			check = "false";
	  		}
	  	}
	  	if (check == "true") {
	  		return true;
	  	} else {
	  		return false;
	  	}
	  }

	  function allGalleriesEmpty() {
	  	var check = "true";
	  	for(var i=0;i<NUMBER_OF_GALLERIES;i++){
	  		if(!($("li", "#gallery"+i).length)){
	  			check = "false";
	  		}
	  	}
	  	if (check == "true") {
	  		return false;
	  	} else {
	  		return true;
	  	}
	  }


	  function logLevel(level, option) {
		//alert("Level: " + level + " - " + option);
	}
	
	function reverseLevel() {
		if (CURRENTLEVEL > -1) {
			if ($.inArray(CURRENTLEVEL,NEXTLEVELS) < 0) {
				NEXTLEVELS.unshift(CURRENTLEVEL.toString());
				CURRENTLEVEL = -1;
			}
		}
		for (var i=0; i<NUMBER_OF_GALLERIES; i++) {
			var slot = $('#slot' + i);
			var piece = $('li', '#slot' + i);
			var pieceID = $('img', piece).attr('piece-id');
			if (pieceID) {
				var move = function(j, p, s){
					movePieceToGallery(p, j);
					unblockPiece(p);
					unblockSlot(s);
				}(i, piece, slot);
			}
		}
	}
});

startTracking = function() {
	// Send request to initialize first gameplay, which also sends a trace for starting a session
	gleaner_tracker.startTracking(oidc_userinfo);
}

showProfile = function() {
	// Remove everything from profile and reload
	$('#badges-container').children().remove();
	$('#stats-game-select').children().remove();
	$('#designer-stats-game-select').children().remove();
	$('#admin-stats-game-select').children().remove();
	$('#high-score-table tbody').children().remove();

	var timer = window.setTimeout(function () { document.title = "Profile" }, 500);

	// Insert oidc_userinfo
	$('div#user_name').text(oidc_userinfo.preferred_username);
	$('div#user_real_name').text(oidc_userinfo.name);
	$('div#user_email').text(oidc_userinfo.email);
	$('div#user_phone').text(oidc_userinfo.phone_number);

	// Query profile

	$.ajax({
		url: gleaner_url + "collect/profiles",
		dataType: "json",
		headers: {
			'Email': oidc_userinfo.email
		},
		success: function(result) {
    	// Insert earnedBadges
    	insertBadges(result);

    	if(result.designed.length > 0) {
    		insertGameDesignerStatistics(result.designed);
    	}

    	if(result.admin === true) {
    		insertAdminStatistics();
    	}
    },
    error: function() {
    	console.log("Can't get badges. Server down?");
    }
});


	getAllGamesHighscore();

	insertPlayerStatistics();
}

function getAllGamesHighscore(){
	formdata = false;
	if (window.FormData) {
		formdata = new FormData();
	}

	$.ajax({
		url: "lib/database/get_all_game_highscore_data.php",
		type: "POST",
		data: formdata,
		processData: false,
		contentType: false,
		success: function(data){
					//alert(data);
					GAME_HIGHSCORE_DATA = JSON.parse(data);
					insertHighScores();
				}
			});
}

insertBadges = function(profile) {
	for(var i = 0; i < profile.earnedBadges.length; i++) {
		var badge = $('<span class="badge-img">' +
			'<img id="badgeImage'+i+'" class="badge-img" onerror="removeImage(this);" src="game_badges/' + profile.earnedBadges[i].path + '">' +
			'<span class="badge-awarded">x'+ profile.earnedBadges[i].awarded +'</span>' +
			'</span>');
		$('div#badges-container').append(badge);
		
	}
}
function removeImage(element){
	$(element).parent().remove();
}
insertHighScores = function() {
	// Query HighScore Ladder for this user

	var jsonobject = {
		"email" :  oidc_userinfo.email,
		"highscoredata": GAME_HIGHSCORE_DATA
	};

	$.ajax({
	  url: gleaner_url + "collect/highscore_configure/", // TODO MARKO add real url
	  dataType: "json",
	  headers: {
	  	'jsonobject': JSON.stringify(jsonobject)
	  },
	  success: function(result) {
    	// If everything went ok, write results
    	var userHighscore = 0;
    	$.each(result, function(i, entry) {
    		if(entry.user == oidc_userinfo.email){
    			userHighscore = entry.score;
    		}
    		$('#high-score-table tbody').prepend(
    			'<tr>' +
    			'<td>' + entry.rank + '</td>' +
    			'<td>' + entry.user + '</td>' +
    			'<td>' + entry.score + '</td>' +
    			'</tr>'
    			)
    	});
    	CURRENT_HIGHSCORE = userHighscore;
    	getExperienceData(userHighscore);
    },
    error: function(err) {
    	console.log(err);
    	console.log("Can't get traces. Server down?");
    }
});
}

function getExperienceData(userHighscore){
	insertExperience(userHighscore);
}
insertExperience = function(userHighscore) {

	var jsonobject = {
		"email" :  oidc_userinfo.email,
		"highscorevalue" : userHighscore,
		"experiencerules" : EXPERIENCE_RULES,
		"experiencelevels" : EXPERIENCE_BADGES
	};
		// Query experience
		$.ajax({
			url: gleaner_url + "collect/experience_configure",
			dataType: "json",
			headers: {
				'jsonobject': JSON.stringify(jsonobject)
			},
			success: function(result) {
	    	// Insert experience progress bar
	    	$('#experience-badge').attr("src",EXPERIENCE_BADGES_PATH + EXPERIENCE_BADGES[result.index].badgeSrc);

	    	$('#level-name').text("Level " + result.level + " - " + result.level_name);

	    	$("#progressbar").progressbar({
	    		value: result.level_progress
	    	});
	    	$('.progress-label').text(result.level_progress + "%");

	    	$('#total-exp').text(result.total_experience);
	    	$('#level-exp').text(result.level_experience);
	    	$('#exp-to-next').text(result.to_next_level);
	    },
	    error: function() {
	    	console.log("Can't get experience. Server down?");
	    }
	});
	}
	insertPlayerStatistics = function() {
	// Insert SelectOptions for each game besides Tutorial
	var myselect = $("select#stats-game-select");
	

	if(GAMESDATA != undefined && GAMESDATA.length != 0){
		//$('#stats-game-select').append('<option value="'+ -1 +'">--Select Game--</option>');
		$.each(GAMESDATA, function(i, game) {
			var game_name = GAMESDATA[i].gameName.toLowerCase();
			var game_id = GAMESDATA[i].gameId;
			if(game_name !== 'tutorial') {
				myselect[0].selectedIndex = i;
				$('#stats-game-select').append('<option value="'+ game_id +'" gameIndex="'+ i +'">' + game_name + '</option>');
			}
		});
	}
	// TODO MARKO Remove this testgame, which is for showcasing only
	//$('#stats-game-select').append('<option value="2">Test Game 2</option>');

	// Query statistics for Hormones game
	//var game = GAMEID;
	myselect.selectmenu("refresh");
	var game_id = $('select[name=stats-game-select]').val();
	var game_index = $('option:selected', $('#stats-game-select')).attr('gameIndex');
	getGameLevelsForStats(game_id,"pie", "player-",game_index);

/*	var collectGameTracesurl = "collect/traces/"+game_id;
	$.ajax({
	  url: gleaner_url + collectGameTracesurl, // TODO MARKO add real url
	  dataType: "json",
	  headers: {
	  	'Email': oidc_userinfo.email
	  },
	  success: function(result) {
    	// If everything went ok, draw the chart
    	chart_creator.drawChart(result,game_index);
    },
    error: function(err) {
    	console.log(err);
    	console.log("Can't get traces. Server down?");
    }
});*/
}

insertGameDesignerStatistics = function(designed_games) {
	if(designed_games.length > 0) {
		$('div.stats#game-designer').show();
	}
	else {
		console.log("No Games designed as of yet!");
		return;
	}

	// Insert SelectOptions for each game the user has designed
	if(designed_games != null){
		$.each(designed_games, function(i, game) {
			$('#designer-stats-game-select').append('<option value="'+ (i + 1) +'">' + GAMESDATA[game].name + '</option>');
		});
	}

	// TODO MARKO Remove this testgame, which is for showcasing only
	$('#designer-stats-game-select').append('<option value="2">Test Game 2</option>');
	$('#designer-stats-game-select').selectmenu('refresh');

	// Query statistics for first game of this user
	$.ajax({
	  url: gleaner_url + "collect/traces/" + designed_games[0] + "?type=designer", // TODO MARKO add real url
	  dataType: "json",
	  headers: {
	  	'Email': oidc_userinfo.email
	  },
	  success: function(result) {
    	// If everything went ok, draw the chart
    	chart_creator.drawChart(result, "", "designer-");
    },
    error: function(err) {
    	console.log(err);
    	console.log("Can't get traces. Server down?");
    }
});
}

insertAdminStatistics = function() {
	$('div.stats#admin').show();
	// Insert SelectOptions for each game besides Tutorial
	if(GAMESDATA != undefined && GAMESDATA.length != 0){
		$.each(GAMESDATA, function(i, game) {
			if(game.name !== 'Tutorial') {
				$('#admin-stats-game-select').append('<option value="'+ i +'">' + game.name + '</option>');
			}
		});
	}

	// TODO MARKO Remove this testgame, which is for showcasing only
	$('#admin-stats-game-select').append('<option value="2">Test Game 2</option>');
	$('#admin-stats-game-select').selectmenu('refresh');

	// Query statistics for Hormones game
	$.ajax({
		url: gleaner_url + "collect/traces/1?type=admin",
		dataType: "json",
		headers: {
			'Email': oidc_userinfo.email
		},
		success: function(result) {
    	// If everything went ok, draw the chart
    	chart_creator.drawChart(result, "", "admin-");
    },
    error: function(err) {
    	console.log(err);
    	console.log("Can't get traces. Server down?");
    }
});
}
