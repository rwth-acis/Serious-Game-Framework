var oidc_userinfo;
var GAME_RULES_DATA;

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
		$('.select').find('option').css("height","20px");

		$(window).resize(function() {
			setGalleryHeight();
			setGalleryWidth();
		});

		$("#dialog").dialog({
			autoOpen: false,
			modal: true
		});

		var galleryElementName = "gameCompletionBadgeGallery";
		var color = "#5f0e88";

		var POPULATEGALLERY = $("#"+galleryElementName),
		POPULATEGALLERYul = $("ul", POPULATEGALLERY);


		$('#gamesruleslink').click(function() { 
			reloadDataFromDatabase();
		});

		$('#select-game-assessment').change(function(){
			$('#rule_gameDescriptionText').text("");
			$('#game-assessment-saved-message').text("");
			
			var description = "";
			var gameId = $('select[name=select-game-assessment]').val();
			if(gameId != 0){
				$('#edit-game-rules-button').find('*').prop('disabled',false);
				$('#edit-game-rules-button').find('*').removeClass('ui-disabled');
				$('#game-save-rules').find('*').prop('disabled',false);
				$('#game-save-rules').find('*').removeClass('ui-disabled');
				var gameIndex = $('option:selected', this).attr('gameIndex');
				description = GAME_RULES_DATA[gameIndex].gameDescription;
				$('#rule_gameDescriptionText').text("");
				var gameDescMessage = $('<h2 style="color:'+color+';">Game Description: '+description+'</h2>');
				$('#rule_gameDescriptionText').append(gameDescMessage);
			}else{
				$('#edit-game-rules-button').find('*').prop('disabled',true);
				$('#edit-game-rules-button').find('*').addClass('ui-disabled');
				resetGameRulesView();
			}

			$('#editgamerulessection').addClass('hideElement');

		});

		$('#select-highscore-assessment').change(function(){
			$('#game-badge-saved-message').text("");
			var highscoreId = $('select[name=select-highscore-assessment]').val();
			if(highscoreId == -1){
				$('#game-save-rules').find('*').prop('disabled',true);
				$('#game-save-rules').find('*').addClass('ui-disabled');
			}else{
				$('#game-save-rules').find('*').prop('disabled',false);
				$('#game-save-rules').find('*').removeClass('ui-disabled');
			}

		});

		$('#edit'+galleryElementName).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
			
			if($(this).hasClass("active")){
				$(this).removeClass("active");
				
			} else {
				$(this).addClass("active");
			}
			$(this).siblings().removeClass("active");
			
		});

		$('#button-edit-game-rules').click(function() {

			$('#editgamerulessection').removeClass('hideElement');
			var gameIndex = $('option:selected', $('#select-game-assessment')).attr('gameIndex');
			populateHighScoreVersions(gameIndex);
			

			var activeBadge = GAME_RULES_DATA[gameIndex]["gameCompletionBadgeSrc"];

			getGameSpecificBadges("gameCompletionBadgeGallery",activeBadge);

		});	

		$('#button-save-game-rules').click(function() {
			saveGameRules();
		});	

		function resetGameRulesView(){

			$('#edit-game-rules-button').find('*').prop('disabled',true);
			$('#edit-game-rules-button').find('*').addClass('ui-disabled');
			
			$('#game-save-rules').find('*').prop('disabled',true);
			$('#game-save-rules').find('*').addClass('ui-disabled');
			$('#editgamerulessection').addClass('hideElement');
			populateGames();
			
			
			setButtonColor($('#edit-game-rules-button'));
			setButtonColor($('#game-save-rules'));
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

		function populateGames(){

			$('#select-game-assessment').children().remove();
			$('#select-game-assessment').append('<option value="'+ 0 +'" description="Select a game from the dropdown and click on \'Edit\' to edit the game assessment">--Select Game--</option>');
			//jsondata = JSON.parse(data);
			jsondata = GAME_RULES_DATA;
			if(jsondata != null && jsondata != undefined && jsondata.length != 0){
				var checkPermission = false;
				
				if(GAME_DESIGNERS != undefined && GAME_DESIGNERS.length != 0){
					$.each(GAME_DESIGNERS, function(index, value) {
						if(value.admin == "true" && value.oidcEmail == oidc_userinfo.email){
							checkPermission = true;
						}
					});
				}
				var myselect1 = $('select#select-game-assessment');
				$.each(jsondata, function(index, value) {
					if(value.oidcEmail == oidc_userinfo.email || checkPermission){
						$('#select-game-assessment').append('<option value="'+ value.gameId +'" gameIndex="'+index+'" description="'+value.gameDescription+'">' + value.gameName + '</option>');
					}
				});
			}
			$('#rule_gameDescriptionText').text("");
			var description = $('option:selected', $('#select-game-assessment')).attr('description');
			var gameDescMessage = $('<h2 style="color:'+color+';">'+description+'</h2>');
			$('#rule_gameDescriptionText').append(gameDescMessage);
			$('#edit-game-rules-button').find('*').prop('disabled',true);
			$('#edit-game-rules-button').find('*').addClass('ui-disabled');

			setButtonColor($("#select-game-assessment").parent());
			myselect1[0].selectedIndex = 0;
			myselect1.selectmenu("refresh");

		}

		function populateHighScoreVersions(gameIndex){
			$('#select-highscore-assessment').children().remove();
			$('#select-highscore-assessment').append('<option value="'+ -1 +'">--Select Highscore Version--</option>');
			jsondata = HIGHSCORE_VERSIONS;

			if(jsondata != null && jsondata != undefined && jsondata.length != 0){
				$.each(jsondata, function(index, value) {
						$('#select-highscore-assessment').append('<option value="'+ value.highscoreId +'" description="">' + value.highscoreId + '</option>');
				});
			}
			setButtonColor($("#select-highscore-assessment").parent());

			var myselect = $("select#select-highscore-assessment");
			myselect[0].selectedIndex = GAME_RULES_DATA[gameIndex]["highscoreId"];
			myselect.selectmenu("refresh");
			
		}

		function getGameSpecificBadges(element,activeli){

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			
			if(formdata){
				$.ajax({
					url: "lib/database/get_game_badges.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						populateGameSpecificBadges(element,activeli,data);
					}
				});
			}
		}

			function populateGameSpecificBadges(element, activeli, filesdata){
			$('#'+element + ' ul').children().remove();
			files = JSON.parse(filesdata);
			length = files.length;
			if(files != null){
				$.each(files, function(index, value) {
					if(value.badgeRequirementId == 1 || value.badgeRequirementId == 7){
					var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + GAME_BADGES_PATH + value.badgeSrc + '" alt="' +  value.badgeSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
					rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
					if(value.badgeSrc == activeli){
						image1.addClass('active');
					}
				}
				});
				setGalleryWidth();
			}
		}

		function saveGameRules(){
			var gameIndex = $('option:selected', $('#select-game-assessment')).attr('gameIndex');
			var gameId = GAME_RULES_DATA[gameIndex]["gameId"];
			var highscoreId = $('select[name=select-highscore-assessment]').val();
			var gameCompletionBadgeSrc = "";
			if($('#edit'+galleryElementName).find(".active").length != 0){
				gameCompletionBadgeSrc = $('#edit'+galleryElementName).find(".active").find(".imgfocus")[0].alt;
			}
			
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			
			formdata.append("gameId",gameId);
			formdata.append("highScoreId",highscoreId);
			formdata.append("gameCompletionBadgeSrc",gameCompletionBadgeSrc);

			if(formdata){
				$.ajax({
					url: "lib/database/update_game_rules.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
					
					GAME_RULES_DATA[gameIndex]["gameCompletionBadgeSrc"] = gameCompletionBadgeSrc;
					GAME_RULES_DATA[gameIndex]["highscoreId"] = highscoreId;
					$('#game-assessment-saved-message').text("");
					var saveGamesRulesMessage = $('<h2 style="color:#48036b;">Game assessment rules saved successfully!</h2>');
					$('#game-assessment-saved-message').append(saveGamesRulesMessage);
				
				}
			});
			}
		}

		function reloadDataFromDatabase(){
			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {
				resetGameRulesView();
			});
		}

		function setGalleryWidth() {
			var galWidth = $('#'+galleryElementName).width();
			$('#ulwrap-'+galleryElementName).width(galWidth-75);
			POPULATEGALLERYul.width((102 * POPULATEGALLERYul.children().length));

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

	}
});