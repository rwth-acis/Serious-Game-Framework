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

		var color="#c37719";

		var LAST_DELETED_VERSION = ""; 
		var HIGHSCORE_VERSIONS = "";

		$('.select').find('option').css("height","20px");

		
		$('#highscoreruleslink').click(function() { //load all the data from database before loading this view
			reloadDataFromDatabase();
		});

		$('#select-highscore').change(function(){ //Depending on the selection, check edit permission and activate suitable buttons
			
			$('#save-highscore-rules-message').text("");
			$('#highscore-desc-message').text("");
			var description = $('option:selected', this).attr('description');
			var descMessage = $('<h2 style="color:'+color+';">'+description+'</h2>');
			var highscoreId = $('select[name=select-highscore]').val();
			if(highscoreId == -1){
				$('#highscore-desc-message').append(descMessage);
			}
			
			$('#highscore-undo-delete-button').fadeOut();
			

			$('#highscore-save-rules').find('*').prop('disabled',true);
			$('#highscore-save-rules').find('*').addClass('ui-disabled');

			var check  = true;
			if(highscoreId == -1){
				check = false;
				$('#show-highscore-button').find('*').prop('disabled',true);
				$('#show-highscore-button').find('*').addClass('ui-disabled');
			}else{
				var email = $('option:selected', $('#select-highscore')).attr('email');
				var checkPermission = false;
				if(email == oidc_userinfo.email){
					checkPermission = true;
				}
				if(GAME_DESIGNERS != undefined && GAME_DESIGNERS.length != 0){
					$.each(GAME_DESIGNERS, function(index, value) {
						if((value.admin == "true")&& value.oidcEmail == oidc_userinfo.email){
							checkPermission = true;
						}
					});
				}
				if(!checkPermission){
					check = false;
					$('#show-highscore-button').find('*').prop('disabled',false);
					$('#show-highscore-button').find('*').removeClass('ui-disabled');
				}else{
					$('#show-highscore-button').find('*').prop('disabled',true);
					$('#show-highscore-button').find('*').addClass('ui-disabled');
				}
				
			}
			
			if(check){
				$('#edit-highscore-button').find('*').prop('disabled',false);
				$('#edit-highscore-button').find('*').removeClass('ui-disabled');

				$('#delete-button-highscore').find('*').prop('disabled',false);
				$('#delete-button-highscore').find('*').removeClass('ui-disabled');
			}
			else{
				$('#edit-highscore-button').find('*').prop('disabled',true);
				$('#edit-highscore-button').find('*').addClass('ui-disabled');

				$('#delete-button-highscore').find('*').prop('disabled',true);
				$('#delete-button-highscore').find('*').addClass('ui-disabled');
				
			}
		});

		$('#button-edit-highscore').click(function() { // enable save button and get the highscore version details of the selected version
			
			$('#save-highscore-rules-message').text("");
			
			$('#highscore-save-rules').find('*').prop('disabled',false);
			$('#highscore-save-rules').find('*').removeClass('ui-disabled');

			$('#highscore-create-rules').find('*').prop('disabled',true);
			$('#highscore-create-rules').find('*').addClass('ui-disabled');
			
			$('#highscore-undo-delete-button').fadeOut();
			var highscoreIndex = $('select[name=select-highscore]').val();
			getHighscoreVersionDetails(highscoreIndex);
			
			
		});

		$('#button-show-highscore').click(function() { //Disable the save button and get the highscore version details of the selected highscore version
			
			$('#save-highscore-rules-message').text("");
			
			$('#highscore-save-rules').find('*').prop('disabled',true);
			$('#highscore-save-rules').find('*').addClass('ui-disabled');

			$('#highscore-create-rules').find('*').prop('disabled',true);
			$('#highscore-create-rules').find('*').addClass('ui-disabled');
			
			$('#highscore-undo-delete-button').fadeOut();
			var highscoreIndex = $('select[name=select-highscore]').val();
			getHighscoreVersionDetails(highscoreIndex);
			
			
		});

		$('#button-reset-highscore').click(function() { //reset this view
			resetHighscoreRulesView();
		});	

		$('#button-save-highscore-rules').click(function() {
			saveHighscoreRules();
		});	

		$('#highscore-create-rules').click(function() {
			createHighscoreRules();
		});	

		$('#button-delete-highscore').click(function() {
			deleteHighscoreVersion();
		});	

		$('#button-undo-delete-highscore').click(function() {
			undoDeleteHighscoreVersion();
		});	



		function resetHighscoreRulesView(){ //reset this view
			$('#select-highscore').children().remove();
			getHighscoreVersionsList();
			
			$('#save-highscore-rules-message').text("");
			$('#highscore-desc-message').text("");
			$('#edit-highscore-button').find('*').prop('disabled',true);
			$('#edit-highscore-button').find('*').addClass('ui-disabled');

			$('#delete-button-highscore').find('*').prop('disabled',true);
			$('#delete-button-highscore').find('*').addClass('ui-disabled');

			$('#show-highscore-button').find('*').prop('disabled',true);
			$('#show-highscore-button').find('*').addClass('ui-disabled');

			$('#highscore-save-rules').find('*').prop('disabled',true);
			$('#highscore-save-rules').find('*').addClass('ui-disabled');

			$('#highscore-create-rules').find('*').prop('disabled',false);
			$('#highscore-create-rules').find('*').removeClass('ui-disabled');

			$('#highscore-undo-delete-button').fadeOut();

			$('#highscore-correct')[0].value = "";
			$('#highscore-wrong')[0].value = "";
			$('#highscore-show')[0].value = "";
			$('#highscore-tryagain')[0].value = "";
			$('#highscore-hint')[0].value = "";


			setButtonColor($('#edit-highscore-button'));
			setButtonColor($('#delete-button-highscore'));
			setButtonColor($('#highscore-undo-delete-button'));
			setButtonColor($('#highscore-create-rules'));
			setButtonColor($('#highscore-save-rules'));
			setButtonColor($('#highscore-reset-button'));
			setButtonColor($('#show-highscore-button'));
		}

		function setButtonColor(divName){ //set colour to all the buttons in this view
			if (divName.find('*').hasClass('ui-btn-inner')) {
				divName.find('*').css("color",color);
			} 
			else {
				divName.trigger('create');
				divName.find('*').css("color",color);
			}
		}

		function getHighscoreVersionsList(){ //get the highscore version data from database
			$.ajax({
				url: "lib/database/get_highscore_versions.php",
				type: "GET",
				contentType: false,
				success: function(data){
					//alert(data);
					HIGHSCORE_VERSIONS = JSON.parse(data);
					createHighscoreVersionsList();
					
				}
			});
		}

		function createHighscoreVersionsList(){ // populate highscore versions in the dropdown
			$('#select-highscore').children().remove();
			$('#select-highscore').append('<option value="'+ -1 +'" description="Select a highscore version from the dropdown and click on \'Edit Highscore Version\' to edit the details">--Select Highscore Version--</option>');
			jsondata = HIGHSCORE_VERSIONS;

			if(jsondata != null && jsondata != undefined && jsondata.length != 0){
				$.each(jsondata, function(index, value) {
					$('#select-highscore').append('<option value="'+ index +'" email="'+value.oidcEmail+'" description="">' + value.highscoreId + '</option>');
				});
			}
			setButtonColor($("#select-highscore").parent());
			var myselect = $("select#select-highscore");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");
			$('#highscore-desc-message').text("");
			var description = $('option:selected', $('#select-highscore')).attr('description');
			var descMessage = $('<h2 style="color:'+color+';">'+description+'</h2>');
			$('#highscore-desc-message').append(descMessage);
			$('#edit-highscore-button').find('*').prop('disabled',true);
			$('#edit-highscore-button').find('*').addClass('ui-disabled');

			$('#delete-button-highscore').find('*').prop('disabled',true);
			$('#delete-button-highscore').find('*').addClass('ui-disabled');
		}

		function getHighscoreVersionDetails(highscoreIndex){ // show the high score version details in the fields

			$('#highscore-correct')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["correct"];
			$('#highscore-wrong')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["wrong"];
			$('#highscore-show')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["showMe"];
			$('#highscore-tryagain')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["tryAgain"];
			$('#highscore-hint')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["hint"];

			
		}

		function saveHighscoreRules(){ //save the highscore rules data to the database

			var correct = $.trim($('#highscore-correct')[0].value);
			var wrong = $.trim($('#highscore-wrong')[0].value);
			var showMe = $.trim($('#highscore-show')[0].value);
			var tryAgain = $.trim($('#highscore-tryagain')[0].value);
			var hint = $.trim($('#highscore-hint')[0].value);
			
			if(!($.isNumeric(correct) && $.isNumeric(wrong) && $.isNumeric(showMe) && $.isNumeric(tryAgain) && $.isNumeric(hint))){
				$('#save-highscore-rules-message').text("");
				var saveHighscoreMessage = $('<h2 style="color:#794b06;">Please enter only numerical values in the fields and try saving again</h2>');
				$('#save-highscore-rules-message').append(saveHighscoreMessage);
			} else{

				formdata = false;
				if (window.FormData) {
					formdata = new FormData();
				}

				var highscoreVersion = $('#select-highscore :selected').text();

				formdata.append("highscoreId",highscoreVersion);
				formdata.append("correct",correct);
				formdata.append("wrong",wrong);
				formdata.append("showMe",showMe);
				formdata.append("tryAgain",tryAgain);
				formdata.append("hint",hint);

				if(formdata){
					$.ajax({
						url: "lib/database/update_highscore.php",
						type: "POST",
						data: formdata,
						processData: false,
						contentType: false,
						success: function(data){
							resetHighscoreRulesView();
							$('#save-highscore-rules-message').text("");
							var saveHighscoreMessage = $('<h2 style="color:#794b06;">Highscore version "'+highscoreVersion+'" is saved successfully!</h2>');
							$('#save-highscore-rules-message').append(saveHighscoreMessage);

						}
					});
				}
			}

		}


		function createHighscoreRules(){ //add new highscore version data to the database and show success message with the new version number

			var correct = $.trim($('#highscore-correct')[0].value);
			var wrong = $.trim($('#highscore-wrong')[0].value);
			var showMe = $.trim($('#highscore-show')[0].value);
			var tryAgain = $.trim($('#highscore-tryagain')[0].value);
			var hint = $.trim($('#highscore-hint')[0].value);
			
			if(!($.isNumeric(correct) && $.isNumeric(wrong) && $.isNumeric(showMe) && $.isNumeric(tryAgain) && $.isNumeric(hint))){
				$('#save-highscore-rules-message').text("");
				var saveHighscoreMessage = $('<h2 style="color:#794b06;">Please enter only numerical values and save again</h2>');
				$('#save-highscore-rules-message').append(saveHighscoreMessage);
			} else{

				formdata = false;
				if (window.FormData) {
					formdata = new FormData();
				}


				formdata.append("correct",correct);
				formdata.append("wrong",wrong);
				formdata.append("showMe",showMe);
				formdata.append("tryAgain",tryAgain);
				formdata.append("hint",hint);
				formdata.append("oidcEmail",oidc_userinfo.email);

				if(formdata){
					$.ajax({
						url: "lib/database/create_highscore.php",
						type: "POST",
						data: formdata,
						processData: false,
						contentType: false,
						success: function(data){
							resetHighscoreRulesView();
							var saveHighscoreMessage = $('<h2 style="color:#794b06;">Highscore version \''+data+'\' is created successfully!</h2>');
							$('#save-highscore-rules-message').append(saveHighscoreMessage);

						}
					});
				}
			}

		}

		function deleteHighscoreVersion(){ //delete highscore version from the database
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			var highscoreVersion = $('#select-highscore :selected').text();

			if(highscoreVersion != 1){

			LAST_DELETED_VERSION = highscoreVersion;

			formdata.append("highscoreId",highscoreVersion);
			formdata.append("deleted","true");
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoHighscore.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){

						resetHighscoreRulesView();
						$('#save-highscore-rules-message').text("");
						var highscoreDeleteMessage = $('<h2 style="color:#794b06;">Highscore version "'+highscoreVersion+'" deleted successfully!</h2>');
						$('#save-highscore-rules-message').append(highscoreDeleteMessage);
						$('#highscore-undo-delete-button').fadeIn();
					}
				});
			}
		}else{
			$('#save-highscore-rules-message').text("");
			var highscoreDeleteMessage = $('<h2 style="color:#794b06;">Highscore version "'+highscoreVersion+'" cannot be deleted. It can only be edited.</h2>');
			$('#save-highscore-rules-message').append(highscoreDeleteMessage);
		}
		}

		function undoDeleteHighscoreVersion(){ //undo deletion of highscore version
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}

			formdata.append("highscoreId",LAST_DELETED_VERSION);
			formdata.append("deleted","false");
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoHighscore.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						$('#highscore-undo-delete-button').fadeOut();
						resetHighscoreRulesView();
						$('#save-highscore-rules-message').text("");
						var highscoreDeleteMessage = $('<h2 style="color:#794b06;">Highscore version "'+LAST_DELETED_VERSION+'" restored successfully!</h2>');
						$('#save-highscore-rules-message').append(highscoreDeleteMessage);

					}
				});
			}
		}

		function reloadDataFromDatabase(){ //load all the data from database and reset this view. This function is called when the user clicks to open this view
			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {
				resetHighscoreRulesView();
			});
		}

	});	
