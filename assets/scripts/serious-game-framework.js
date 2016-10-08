var UPLOADPATH = "uploads/";
var DEBUG = false;

// 0: very easy (only one piece left to fill)
// 1: easy (only two pieces left to fill)
// 2: medium (user chooses first piece; system gives one other piece)
// 3: hard (free game)
// 4: very hard (one random piece will be shown and the user has to pick the missing ones IMPLEMENTED
var DIFFICULTY = 3;
var NEWDIFFICULTY = 3;
var SHOWME = false;

var GAMEID = -1;

var GOTDATA = false;
var GAMESDATA;
var LEVELDATA;
var PIECESDATA;
var CONNECTIONSDATA;
var TUTORIALSDATA;


//var INTRO = introJs();
var TUTORIAL = false;
var TUTORIALSTARTED = false;

var NEXTLEVELS = [];
var LEVELSDONE = [];
var CURRENTLEVEL = -1;
var SELECTEDITEMS = [];
var GAMESTATE = "leveldone";

// TODO MARKO add real oidc_userinfo
//var oidc_userinfo = {name: "Marko Kajzer", preferred_username: "marko.kajzer", email: "marko.kajzer@hotmail.de"};
var gleaner_url = "http://gaudi.informatik.rwth-aachen.de:3000/"; // TODO ADD REAL LOCATION HERE

var correct = 0;
var wrong = 0;
var elearning = 0;

var badge_asserter = new BadgeAsserter();
var gleaner_tracker = new GleanerTracker();
var chart_creator = new ChartCreator();

// When DOM is loaded do the following
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


	fillGamesList(GAMESDATA);
	
	$('.descriptionlink').click(function(){
		var gameID = $(this).attr('game-id');
		GAMEID = parseInt(gameID);
		
		$('.gametitledescription').empty().append(GAMESDATA[gameID].name);
		$('.description').empty().append('<h4>' + GAMESDATA[gameID].descriptionpage + '</h4>');
		
		
		$('.linktogame').empty().append('<a href="#game" id="game-id-'+ gameID + '" game-id="' + gameID + '" class="gamesslink">Weiter zum Spiel</a>');

		
			$('.gamesslink').click(function(){
			
			loadGame(GAMEID);
			
			
			

			// Send trace for starting a game
			gleaner_tracker.trackTrace(oidc_userinfo, "game_start",
																{gameID: GAMEID});
		});
		
		
	});

	$('.gameslink').click(function(){
			var gameID = $(this).attr('game-id');
			GAMEID = parseInt(gameID);
			loadGame(GAMEID);
			

			// Send trace for starting a game
			gleaner_tracker.trackTrace(oidc_userinfo, "game_start",
																{gameID: GAMEID});
		});
	
	
	

	$('.options-button').click(function(){
		selectCurrentOptions();
	});

	$('#elearningbachelor').click(function() {
		elearning++;
		// Send trace for clicking an eLearning link
		gleaner_tracker.trackTrace(oidc_userinfo, "elearning",
															{gameID: GAMEID, levelID: CURRENTLEVEL});
	});

	$('#elearningmaster').click(function() {
		elearning++;
		// Send trace for clicking an eLearning link
		gleaner_tracker.trackTrace(oidc_userinfo, "elearning",
															{gameID: GAMEID, levelID: CURRENTLEVEL});
	});
	
	// Functions for Player Statistics
	$('#stats-game-select').change(function(element) {
		var act_type = $('#chart-1')[0].checked ? "pie" : "bar";
		chart_creator.changeChart($("#stats-game-select option:selected").val(), act_type);
	});
	$('#chart-1').click(function() {
		chart_creator.changeChart($("#stats-game-select option:selected").val(), $('#chart-1').val());
	});
	$('#chart-2').click(function() {
		chart_creator.changeChart($("#stats-game-select option:selected").val(), $('#chart-2').val());
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
		showMe();

		// Send trace for using the show_me button
		gleaner_tracker.trackTrace(oidc_userinfo, "level_completion",
															{gameID: GAMEID, levelID: CURRENTLEVEL, result: "show_me"});
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
	
	function fillGamesList(gamesData) {
		$.each(gamesData, function(i, data) {
			// i: gameID
			// data: gameData
			//alert(i + " - " + data.name);
			//var game = $('<a class="ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-right ui-btn-up-c" game-id="' + i + '" data-transition="slide" data-iconpos="right" data-icon="arrow-r" data-role="button" href="#game" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c">' + data.name + '</a>');

			
			
				var game = $('<li><a href="#descriptionpage" id="game-id-'+ i + '" game-id="' + i + '" class="descriptionlink"><h3>' + data.name + '</h3><p>' + data.description + '</p></a></li>');
				//var game = $('<li><a href="#game" id="game-id-'+ i + '" game-id="' + i + '" class="gamelink"><h3>' + data.name + '</h3><p>' + data.description + '</p></a></li>');
				$('.gameslist').append(game);
			
		});
		$('.gameslist').listview('refresh');
	}

	function loadGame(gameID) {
		if (gameID > -1) {
			$('#wrapper-level-tutorial').fadeOut();
			$('#wrapper-back-main').fadeOut();
			$('#wrapper-showme').fadeOut();
			$('#wrapper-next').fadeOut();
			$('#elearningbachelor').empty();
			$('#elearningbachelor').fadeOut();
			$('#elearningmaster').empty();
			$('#elearningmaster').fadeOut();
			$('#leveldone').fadeOut();
			$('#levelcontrol').fadeOut();
			$('#inforow').hide();

			$('.gametitle').empty().append(GAMESDATA[gameID].name);
			

				
			

			// set the gallery and slot titles if available
			for (var i=0; i < 4; i++) {
				if (GAMESDATA[gameID].slotnames[i]) {
					$('#header-slot' + i).empty().append(GAMESDATA[gameID].slotnames[i]);
					$('#header-gallery' + i).empty().append(GAMESDATA[gameID].slotnames[i]);
					$('#header-slot' + i).fadeIn();
					$('#header-gallery' + i).fadeIn();
					$('#gallery' + i ).fadeIn();
					$('#wrapperslot' + i).fadeIn();
					$('#connection' + i).fadeIn();
				} else {
					$('#header-slot' + i).empty().append("Slot " + (i+1));
					$('#header-gallery' + i).empty().append(i+1);
					$('#header-slot' + i).hide();
					$('#header-gallery' + i).hide();
					$('#gallery' + i ).hide();
					$('#wrapperslot' + i).hide();
					$('#connection' + i).hide();
					$('#info' + i).hide();
					if(gameID == 2){
						$('#connection2').hide();
					}
				}
			}
			clearGalleries();
			initializeLevelState();
			loadGaleries(gameID);
			initializeDragDrop();

			clearGameboard();
			nextLevel();

			TUTORIAL = false;
			addTutorialTexts();
			// Show the tutorial, if the game is marked as tutorial
			if (TUTORIAL) {
				$('#levelcontrol').fadeIn();
				$('#wrapper-level-tutorial').fadeIn();
			} else {
				$('#wrapper-level-tutorial').fadeOut();
			}
			var timer = window.setTimeout(function () { document.title = GAMESDATA[gameID].name }, 500);

		}
	}
	
	function startTutorial() {
		introJs().start();
		$('#wrapper-showme').fadeIn();
		$('#button-showme').show();
		$('#elearningbachelor').empty();
		$('#elearningmaster').empty();
		$('#elearningmaster').fadeOut();
		$('#elearningbachelor').fadeIn();
		$('#elearningbachelor').append('<a href="' + LEVELDATA[0].elearningbachelor + '" target="_blank">E-Learning Link</a>');
		TUTORIALSTARTED = true;
	}
	
	function addTutorialTexts() {
		//var tutorialSteps;
		$.each(TUTORIALSDATA, function(i, data) {
			// i: Tutorial ID
			// data: Tutorial data
			if (data.game == GAMEID) {
				TUTORIAL = true;
				$.each(data.tutorials, function(j, tutData) {
					// j: data-step
					// tutData.identifier: A jQuery identifier where the tutorial text should be added
					// tutData.text: Tutorial Text of this step
					// tutData.position: Position of the tutorial text
					
					var area = $(tutData.identifier);
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

	function initializeLevelState() {
		NEXTLEVELS = [];
		LEVELSDONE = [];
		CURRENTLEVEL = -1;
		GAMESTATE = "leveldone";
	}

	function clearGameboard() {
		unblockAllSlots();
		for (var i = 0; i <= 3; i++) {
			var piece = $('li', '#slot' + i);
			var remove = function(p){
				p.remove();
			}(piece);
		}
	}

	function clearGalleries() {
		for (var i=0; i <= 3; i++) {
			var clear = function(j) {
				$('ul', "#gallery" + j).empty();
			}(i);
		}
	}

	/**
	  * Fills the four galleries with data
	  * @param gameID The ID of the current game.
	  */
	function loadGaleries( gameID ) {
		var pieceCounter = new Array();

		$.each(LEVELDATA, function(i, data) {
			// i: levelID
			// data: level data
			if (data.game_id == gameID) {
				rand(0,1) ? NEXTLEVELS.push(parseInt(i)) : NEXTLEVELS.unshift(parseInt(i));
				$.each(data.pieces, function(j, p) {
					// j: index of piece [1,4]
					// p: piece id
					if (p >= 0) {
						if (pieceCounter[p]) {
							pieceCounter[p]++;
							$('img[piece-id=' + p + ']', '#gallery' + j + ' ul').attr('piece-count',pieceCounter[p]);

						} else {
							//if some nice lightbox plugin is found: var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="' + UPLOADPATH + PIECESDATA[p].src + '" title="' + PIECESDATA[p].description + '"><img src="' + UPLOADPATH + PIECESDATA[p].src + '" alt="' + PIECESDATA[p].description + '" width="96" height="72" piece-id="' + p + '" piece-count="1" /></a></li>');

							var image1 = $('<li class="ui-widget-content ui-corner-tr piece" draggable="true"><img src="' + UPLOADPATH + PIECESDATA[p].src + '" alt="' + PIECESDATA[p].description + '" width="94" height="68" id="piece-id-'+p+'" piece-id="' + p + '" piece-count="1" /></li>');

							
							if(gameID==1001 && j == 3){
								$('#gallery' + j + ' ul').append(image1);
							}else if(gameID==1002 && j==3){
								$('#gallery' + j + ' ul').append(image1);
							}else{
								rand(0,1) ? $('#gallery' + j + ' ul').prepend(image1) : $('#gallery' + j + ' ul').append(image1);
							}
							pieceCounter[p] = 1;
						}
					}
				});
			}
		} );
		setGalleryWidth();
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
		makeSlotsDroppable();
		makeGalleriesDroppable();
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
	function makeSlotsDroppable() {
		for (var i=0; i <= 3; i++) {
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
	function makeGalleriesDroppable() {
		for (var i=0; i <= 3; i++) {
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
		var pieceID = parseInt($("img", piece).attr('piece-id'));
		//var arrEntry = new Object();
		//arrEntry["piece"] = pieceID;
		//arrEntry["slot"] = slotID;
		var arrEntry = [pieceID, slotID];
		SELECTEDITEMS.push(arrEntry);
	}
	
	function deleteFromSelectedItems(piece, slotID) {
		var pieceID = parseInt($("img", piece).attr('piece-id'));
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
			piece.prependTo( $("ul", gallery) ).fadeIn();
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
			piece.prependTo( $("ul", gallery) ).fadeIn();
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
	}
	
	function unblockPiece(piece) {
		//var pID = $('img', piece).attr('piece-id');
		//alert("unblockPiece: " + pID);
		
		piece.draggable( "enable" );
	}
	
	function blockSlot(slot, option) {
		//alert("blockSlot: " + slot.attr('id') + " - " + option);
		
		slot.droppable( "disable" );
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
		slot.droppable( "enable" );
	}
	
	function unblockAllSlots() {
		for (var i = 0; i <= 3; i++) {
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
				//if (tmpres.length == 1) {
					res = tmpres[0];
				//} else {
					//res = -1;
					
				
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
					
					if (LEVELDATA[levelID].game_id == GAMEID) {
						if (LEVELDATA[levelID].pieces[tmpSlotID] != tmpPieceID) {
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
		
		var p = [-1,-1,-1,-1];
		p[0] = $("img", slot0).attr('piece-id')
		p[1] = $("img", slot1).attr('piece-id')
		p[2] = $("img", slot2).attr('piece-id')
		p[3] = $("img", slot3).attr('piece-id')
		
		//alert(p[0]);
		var oldMatching = 0;
		
		if (oldLevel > -1) {
			for (var i = 0; i <= 3; i++) {
				if (LEVELDATA[oldLevel].pieces[i] == p[i]) {
					oldMatching++;
				}
			}
		}
		
		var bestMatching = oldMatching;
		var bestFittingLevel = oldLevel;
		
		//alert("oldMatching: " + bestMatching);
		
		$.each(LEVELDATA, function(j, data) {
			// i: levelID
			// data: level data
			if (data.game_id == GAMEID) {
				var tmpMatching = 0;
				for (var i = 0; i <= 3; i++) {
					if (LEVELDATA[j].pieces[i] == p[i]) {
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
			$('#wrapper-next').fadeOut();
			$('.level-verification').fadeOut();
			$('#elearningbachelor').fadeOut().empty();
			$('#elearningmaster').fadeOut().empty();
			$('#wrapper-level-tutorial').fadeOut();
			$('#levelcontrol').fadeOut();
			
			$('#inforow').fadeOut();
			
			
			for (var i = 0; i <= 3; i++) {
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
							if(GAMEID == 1001){
								slotID = 0;
							}
							if(GAMEID == 1002){
								slotID = 3;
							}
							pieceID = LEVELDATA[CURRENTLEVEL].pieces[slotID];
							//alert(CURRENTLEVEL + " - " + slotID + " - " + pieceID);
						} while (pieceID < 0);
						
						var slot =  $('#slot' + slotID);
						var gallery = $('#gallery' + slotID);
						var list = $( "li", slot );
						var piece = $('img[piece-id=' + pieceID + ']', '#gallery' + slotID + ' ul').parent();
						
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
		for (var i = 0; i <= 2; i++) {
			$('#connection' + i).empty();
		}
	}
	
	function setConnections() {
		if (CURRENTLEVEL > -1) {
			for (var i = 0; i <= 2; i++) {
				var c = LEVELDATA[CURRENTLEVEL].connections[i];
				//alert(c);
				if (c > -1) {
					var connection = $('<img src="' + UPLOADPATH + CONNECTIONSDATA[c].src + '" alt="' + CONNECTIONSDATA[c].description + '" width="32" height="32" connection-id="' + c + '" />');
					$('#connection' + i).append(connection);
				}
			}
		}
	}
	
	function blockUnusedSlots() {
		if (CURRENTLEVEL > -1) {
			for (var i = 0; i <= 3; i++) {
				if (LEVELDATA[CURRENTLEVEL].pieces[i] < 0) {
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
			for (var i = 0; i <= 3; i++) {
				if (LEVELDATA[CURRENTLEVEL].pieces[i] < 0) {
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
					$('#elearningbachelor').empty();
					$('#elearningbachelor').fadeIn();
					$('#elearningmaster').empty();
					$('#elearningmaster').fadeIn();
					if (LEVELDATA[l].elearningbachelor) {
							if(GAMEID==1001){
									$('#elearningbachelor').append('<a href="' + LEVELDATA[l].elearningbachelor + '" target="_blank">E-Learning Link</a>');
							}
							else if(GAMEID==1002){
								$('#elearningbachelor').append('<a href="' + LEVELDATA[l].elearningbachelor + '" target="_blank">Link Mahlzeit</a>');
							}
							else{
								$('#elearningbachelor').append('<a href="' + LEVELDATA[l].elearningbachelor + '" target="_blank">E-Learning Link</a>');
							}
						}
						
						if (LEVELDATA[l].elearningmaster) {
							if(GAMEID==1001){
									$('#elearningmaster').append('<a href="' + LEVELDATA[l].elearningmaster + '" target="_blank">Weitere Informationen</a>');
							}
							else if(GAMEID==1002){
								$('#elearningmaster').append('<a href="' + LEVELDATA[l].elearningmaster + '" target="_blank">Link Getränk</a>');
							}
							else{
								$('#elearningmaster').append('<a href="' + LEVELDATA[l].elearningmaster + '" target="_blank">E-Learning Link</a>');
							}
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
					var p = [-1,-1,-1,-1];
					
					p[0] = $("img", slot0).attr('piece-id');
					p[1] = $("img", slot1).attr('piece-id');
					p[2] = $("img", slot2).attr('piece-id');
					p[3] = $("img", slot3).attr('piece-id');
					
					
					
					// if(GAMEID == 1){
						// p[2] = LEVELDATA[l].pieces[2];
						// p[3] = LEVELDATA[l].pieces[3];
					// }
					
					
					//if (typeof p3 == 'undefined') {
					//alert("Antwort: " + p0 + ", " + p1 + ", " + p2 + ", " + p3);
					//}
					
					var correct = false;
					var levelStructure = true;
					
					for (var i = 0; i <= 3; i++) {
						if ((LEVELDATA[l].pieces[i] > -1) != (p[i] > -1)) {
							levelStructure = false;
						}
					}
					
					
					if (levelStructure) {
						
						//console.log(PIECESDATA[p[0]].description);
						console.log(PIECESDATA[p[1]]);
						console.log(PIECESDATA[p[2]]);
						console.log(PIECESDATA[p[3]]);
						
						if(GAMEID == 1002){
							$('#inforow').show();
							$('#info0').text(PIECESDATA[p[0]].kohlenhydrate);
							$('#info2').text(PIECESDATA[p[2]].kohlenhydrate);
							$('#info3').text(PIECESDATA[p[3]].kohlenhydrate);
						}
						
						//alert("Structure OK");
						if ( 	((LEVELDATA[l].pieces[0] == p[0]) || (LEVELDATA[l].pieces[0] == -1))
							&& 	((LEVELDATA[l].pieces[1] == p[1]) || (LEVELDATA[l].pieces[1] == -1))
							&& 	((LEVELDATA[l].pieces[2] == p[2]) || (LEVELDATA[l].pieces[2] == -1))
							&& 	((LEVELDATA[l].pieces[3] == p[3]) || (LEVELDATA[l].pieces[3] == -1)) ) {
							correct = true;
						}

						GAMESTATE = "leveldone";
						$('#wrapper-level-tutorial').fadeOut();
						$('#wrapper-showme').fadeOut();
						$('#wrapper-level-tutorial').fadeOut();
						$('#elearningbachelor').empty();
						$('#elearningbachelor').fadeIn();
						$('#elearningmaster').empty();
						$('#elearningmaster').fadeIn();
						if (LEVELDATA[l].elearningbachelor) {
							if(GAMEID==1001){
									$('#elearningbachelor').append('<a href="' + LEVELDATA[l].elearningbachelor + '" target="_blank">E-Learning Link</a>');
							}
							else if(GAMEID==1002){
								$('#elearningbachelor').append('<a href="' + LEVELDATA[l].elearningbachelor + '" target="_blank">Link Mahlzeit</a>');
							}
							else{
								$('#elearningbachelor').append('<a href="' + LEVELDATA[l].elearningbachelor + '" target="_blank">E-Learning Link</a>');
							}
						}
						
						if (LEVELDATA[l].elearningmaster) {
							if(GAMEID==1001){
									$('#elearningmaster').append('<a href="' + LEVELDATA[l].elearningmaster + '" target="_blank">Weitere Informationen</a>');
							}
							else if(GAMEID==1002){
								$('#elearningmaster').append('<a href="' + LEVELDATA[l].elearningmaster + '" target="_blank">Link Getränk</a>');
							}
							else{
								$('#elearningmaster').append('<a href="' + LEVELDATA[l].elearningmaster + '" target="_blank">E-Learning Link</a>');
							}
						}

						if (!correct) {
							logLevel(l, "wrong");
							// Tell the user that the solution is wrong
							$('#level-verification-wrong').show();

							// Send traces with result = "wrong", do not track in Tutorial
							if(!TUTORIAL) {
								wrong++;
								gleaner_tracker.trackTrace(oidc_userinfo, "level_completion",
																					{gameID: GAMEID, levelID: CURRENTLEVEL, result: "wrong"});
							}
						} else {
							logLevel(l, "correct");
							// Tell the user that the solution is correct
							$('#level-verification-correct').show();

							// Send traces with result = "correct", do not track in Tutorial
							if(!TUTORIAL) {
								correct++;
								gleaner_tracker.trackTrace(oidc_userinfo, "level_completion",
																				{gameID: GAMEID, levelID: CURRENTLEVEL, result: "correct"});
							}
						}
						for (var i = 0; i <= 3; i++) {
							var slot = $('#slot' + i);
							if (LEVELDATA[l].pieces[i] > -1) {
								if (!slot.hasClass('slot-blocked')) {
									if (LEVELDATA[l].pieces[i] == p[i]) {
										setSlotColor(slot,"green");
									} else {
										setSlotColor(slot,"red");
									}
								}
							}
							var slotPieceID = $('img', slot).attr('piece-id');
							if (slotPieceID) {
								var piece = $('img[piece-id=' + slotPieceID + ']', slot).parent().attr("testattr","hier");
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
							$('#leveldone').fadeIn();
							$('#leveldone').empty().append('All levels done.');
							$('#wrapper-back-main').fadeIn();

							// here all levels have been completed -> award badge of this game
							var game_name = GAMESDATA[GAMEID].name.toLowerCase();
							// console.log(game_name);
							this.badge_asserter.assertBadge(game_name, oidc_userinfo, "");
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
			for (var i = 0; i <= 3; i++) {
				var slot = $('#slot' + i);
				var piece = $('li', '#slot' + i);
				if (slot.hasClass('slot-red')) {
					var move = function(j, level, p, s){
						movePieceToGallery( p, j );
						unblockPiece(p);
						pieceID = LEVELDATA[level].pieces[j];
						var piece2 = $('img[piece-id=' + pieceID + ']', '#gallery' + j + ' ul').parent();
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
		var l = CURRENTLEVEL;
		var selected = [-1,-1,-1,-1];

		selected[0] = $("img", slot0).attr('piece-id');
		selected[1] = $("img", slot1).attr('piece-id');
		selected[2] = $("img", slot2).attr('piece-id');
		selected[3] = $("img", slot3).attr('piece-id');
		
		

		if (l > -1) {
			//alert("level > -1");
			SHOWME = true;
			
			if(GAMEID == 1002){
							$('#inforow').show();
							$('#info0').text(PIECESDATA[LEVELDATA[l].pieces[0]].kohlenhydrate);
							$('#info2').text(PIECESDATA[LEVELDATA[l].pieces[2]].kohlenhydrate);
							$('#info3').text(PIECESDATA[LEVELDATA[l].pieces[3]].kohlenhydrate);
			}
			
			for (var i = 0; i <= 3; i++) {
				var slot = $('#slot' + i);
				var piece = $('li', '#slot' + i);
				blockPiece(piece);
				if (LEVELDATA[l].pieces[i] > -1) {
					if (!slot.hasClass('slot-blocked')) {
						if (LEVELDATA[l].pieces[i] == selected[i]) {
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
						if (selected[i] > -1) {
							movePieceToGallery( p, j );
						}
						unblockPiece(p);
						pieceID = LEVELDATA[level].pieces[j];
						var piece2 = $('img[piece-id=' + pieceID + ']', '#gallery' + j + ' ul').parent();
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
	
	/**
	  * Returns true if all slots are filled.
	  * NOT REALLY NEEDED ANYMORE
	  */
	function allSlotsFilled() {
		if (($("li", slot0).length) && ($("li", slot1).length) && ($("li", slot2).length) && ($("li", slot3).length)) {
			return true;
		} else {
			return false;
		}
	}
	
	function allGalleriesEmpty() {
		if ( ($("li", GALLERY0).length) || ($("li", GALLERY1).length) || ($("li", GALLERY2).length) || ($("li", GALLERY3).length) ) {
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
		for (var i=0; i<4; i++) {
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

	insertExperience();

	insertHighScores();

	insertPlayerStatistics();
}

insertBadges = function(profile) {
	for(var i = 0; i < profile.earnedBadges.length; i++) {
		var badge = $('<span class="badge-img">' +
				'<img class="badge-img" src="data/badges/' + profile.earnedBadges[i].path + '-badge.png">' +
				'<span class="badge-awarded">x'+ profile.earnedBadges[i].awarded +'</span>' +
			'</span>');
		$('div#badges-container').append(badge);
	}
}

insertExperience = function() {
		// Query experience
		$.ajax({
		  url: gleaner_url + "collect/experience",
		  dataType: "json",
		  headers: {
	      'Email': oidc_userinfo.email
	    },
	    success: function(result) {
	    	// Insert experience progress bar
	    	$('#experience-badge').attr("src","assets/images/experience/level" + result.level + ".png");

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

insertHighScores = function() {
	// Query HighScore Ladder for this user
	$.ajax({
	  url: gleaner_url + "collect/highscore/", // TODO MARKO add real url
	  dataType: "json",
	  headers: {
      'Email': oidc_userinfo.email
    },
    success: function(result) {
    	// If everything went ok, write results
    	$.each(result, function(i, entry) {
				$('#high-score-table tbody').prepend(
					'<tr>' +
						'<td>' + entry.rank + '</td>' +
						'<td>' + entry.user + '</td>' +
						'<td>' + entry.score + '</td>' +
					'</tr>'
				)
    	});
    },
    error: function(err) {
    	console.log(err);
    	console.log("Can't get traces. Server down?");
    }
	});
}

insertPlayerStatistics = function() {
	// Insert SelectOptions for each game besides Tutorial
	$.each(GAMESDATA, function(i, game) {
		if(game.name !== 'Tutorial') {
			$('#stats-game-select').append('<option value="'+ i +'">' + game.name + '</option>');
		}
	});

	// TODO MARKO Remove this testgame, which is for showcasing only
	$('#stats-game-select').append('<option value="2">Test Game 2</option>');

	// Query statistics for Hormones game
	$.ajax({
	  url: gleaner_url + "collect/traces/1", // TODO MARKO add real url
	  dataType: "json",
	  headers: {
      'Email': oidc_userinfo.email
    },
    success: function(result) {
    	// If everything went ok, draw the chart
    	chart_creator.drawChart(result);
    },
    error: function(err) {
    	console.log(err);
    	console.log("Can't get traces. Server down?");
    }
	});
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
	$.each(designed_games, function(i, game) {
		$('#designer-stats-game-select').append('<option value="'+ (i + 1) +'">' + GAMESDATA[game].name + '</option>');
	});

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
	$.each(GAMESDATA, function(i, game) {
		if(game.name !== 'Tutorial') {
			$('#admin-stats-game-select').append('<option value="'+ i +'">' + game.name + '</option>');
		}
	});

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
