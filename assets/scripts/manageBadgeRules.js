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
		$('.select').find('option').css("height","20px");

		$(window).resize(function() {
			setGalleryHeight();
			setGalleryWidth();
		});

		$("#dialog").dialog({
			autoOpen: false,
			modal: true
		});

		var galleryElementName = "gameBadgeGallery";
		var color = "#069090";
		//gallery element
		var POPULATEGALLERY = $("#"+galleryElementName),
		POPULATEGALLERYul = $("ul", POPULATEGALLERY);

		var LAST_DELETED_GAME_BADGE_SRC = "";
		var BADGE_INDEX = "";

		
		$('#badgeruleslink').click(function() { 
			reloadDataFromDatabase(); //make sure that the data is loaded from database before opening this view.
		});

		$('#game-badge-name').on('change keyup paste',function() { 
			$('#game-badge-saved-message').text("");
			enableGameBadgeCreation(); //check validity of the fields before enabling the add badge button
		});

		$('#select-badge-requirement').change(function(){  //depending on the badge requirement id, disable or enable the text field next to it. 
			$('#game-badge-saved-message').text("");
			var badgeRequirementId = $('select[name=select-badge-requirement]').val();
			if(badgeRequirementId == 0 || badgeRequirementId == 1 || badgeRequirementId == 6 || badgeRequirementId == 7){
				$('#game-badge-points')[0].value = "";
				$("#game-badge-points").attr('disabled','disabled');
				$("#game-badge-points").parent().css( "background-color", "#e7e7e7" );
			}else{
				$('#game-badge-points').parent().parent().find('*').removeAttr('disabled');
				$('#game-badge-points').parent().parent().find('*').removeClass('ui-disabled');
				$('#game-badge-points').parent().parent().find('*').removeClass('ui-state-disabled');
				$("#game-badge-points").parent().parent().find('*').css( "background-color", "" );
			}
			enableGameBadgeCreation();

		});	

		$('#edit-select-badge-requirement').change(function(){ //depending on the badge requirement id, disable or enable the text field next to it.
			$('#game-badge-saved-message').text("");
			var badgeRequirementId = $('select[name=edit-select-badge-requirement]').val();
			if(badgeRequirementId == 0 || badgeRequirementId == 1 || badgeRequirementId == 6 || badgeRequirementId == 7){
				$('#edit-game-badge-points')[0].value = "";
				$("#edit-game-badge-points").attr('disabled','disabled');
				$("#edit-game-badge-points").parent().css( "background-color", "#e7e7e7" );
			}else{
				$('#edit-game-badge-points').parent().parent().find('*').removeAttr('disabled');
				$('#edit-game-badge-points').parent().parent().find('*').removeClass('ui-disabled');
				$('#edit-game-badge-points').parent().parent().find('*').removeClass('ui-state-disabled');
				$("#edit-game-badge-points").parent().parent().find('*').css( "background-color", "" );
			}
			enableGameBadgeCreation();

		});

		$('#game-badge-points').on('change keyup paste',function() { //check validity of the fields before enabling the add badge button
			$('#game-badge-saved-message').text("");
			$('#game-badge-error-message').text("");
			if(!$.isNumeric($.trim($('#game-badge-points')[0].value))){
				var createBadgeMessage = $('<h2 style="color:#036363;">Enter numeric value in \'Badge Requirement\' field</h2>');
				$('#game-badge-error-message').append(createBadgeMessage);
			}
			enableGameBadgeCreation();
			
		});
		
		$('#edit-game-badge-name').on('change keyup paste',function() { //check validity of the fields before enabling the save button
			$('#game-badge-saved-message').text("");
			enableGameBadgeSaveButton();
		});


		
		$('#edit'+galleryElementName).on('click', 'li', function() { //when the user clicks on the badge, check whether they have admin rights and then enable the edit, delete buttons.
			$('#game-badge-undo-delete-button').fadeOut();
			resetGameBadgeEditView();
			var checkPermission = false;
			if($(this).attr('email') == oidc_userinfo.email){
				checkPermission = true;
			}
			if(GAME_DESIGNERS != undefined && GAME_DESIGNERS.length != 0){
				$.each(GAME_DESIGNERS, function(index, value) {
					if((value.admin == "true" || value.admin == "part") && value.oidcEmail == oidc_userinfo.email){
						checkPermission = true;
					}
				});
			}
			if(checkPermission){
				BADGE_INDEX = $(this).attr('badgeIndex');
				$('#game-badge-saved-message').text("");

				if($(this).hasClass("active")){
					$(this).removeClass("active");
					$('#edit-game-badge-button').find('*').prop('disabled',true);
					$('#edit-game-badge-button').find('*').addClass('ui-disabled');
					$('#game-badge-delete-button').find('*').prop('disabled',true);
					$('#game-badge-delete-button').find('*').addClass('ui-disabled');
				} else {
					$(this).addClass("active");
					$('#edit-game-badge-button').find('*').prop('disabled',false);
					$('#edit-game-badge-button').find('*').removeClass('ui-disabled');
					$('#edit-game-badge-button').css('opacity','1');
					$('#game-badge-delete-button').find('*').prop('disabled',false);
					$('#game-badge-delete-button').find('*').removeClass('ui-disabled');
					$('#game-badge-delete-button').css('opacity','1');
				}
				$(this).siblings().removeClass("active");
			}
		});
		$('#button-delete-game-badge').click(function(){ //delete badge
			$('#game-badge-undo-delete-button').fadeOut();
			$('#game-badge-saved-message').text("");
			var filename = $('#edit'+galleryElementName).find(".active").find(".imgfocus")[0].alt;
			deleteGameBadge(filename);		

		});

		$('#button-edit-game-badge').click(function(){ //populate all the badge details in the edit view
			$('#game-badge-undo-delete-button').fadeOut();
			
			$('#game-badge-saved-message').text("");

			activateGameBadgeEditView();

			$('#edit-game-badge-name')[0].value = GAME_BADGES[BADGE_INDEX]["badgeName"];
			$('#edit-game-badge-desc')[0].value = GAME_BADGES[BADGE_INDEX]["badgeDescription"];
			$('#edit-game-badge-feedback')[0].value = GAME_BADGES[BADGE_INDEX]["badgeFeedbackMessage"];
			$('#edit-game-badge-points')[0].value = GAME_BADGES[BADGE_INDEX]["requirementValue"];	
			
			var myselect = $("select#edit-select-badge-requirement");
			myselect[0].selectedIndex = GAME_BADGES[BADGE_INDEX]["badgeRequirementId"];
			myselect.selectmenu("refresh");
			
		});

		$('#game-badge-save-button').click(function(){ //save the details
			$('#game-badge-undo-delete-button').fadeOut();
			
			$('#game-badge-saved-message').text("");

			var filename = $('#edit'+galleryElementName).find(".active").find(".imgfocus")[0].alt;
			saveGameBadge(filename);		

		});

		$('#button-undo-delete-game-badge').click(function(){ //undo badge deletion
			$('#badge-badge-undo-delete-button').fadeOut();
			
			$('#game-badge-saved-message').text("");
			undoDeleteGameBadge();		
		});

		
		$('input[id=uploadGameBadge]').on('change', uploadGameBadge);
		$('input[id=uploadGameBadge]').click(function(){ //upload button action
			$('#game-badge-undo-delete-button').fadeOut();
			
			$('#game-badge-saved-message').text("");
		});


		$('#show-game-badges').click(function(){ //show all the badges
			$('#game-badge-undo-delete-button').fadeOut();
			$('#'+galleryElementName + ' ul').children().remove();
			getGameBadges();
		});

		
		function resetGameBadgeRulesView(){ //reset the view
			$('#'+galleryElementName + ' ul').children().remove();
			$('#edit-game-badge-button').find('*').prop('disabled',true);
			$('#edit-game-badge-button').find('*').addClass('ui-disabled');
			$('#game-badge-delete-button').find('*').prop('disabled',true);
			$('#game-badge-delete-button').find('*').addClass('ui-disabled');
			$('#uploadGameBadge').prop('disabled',true);
			$('.fileinput-button').css('opacity','0.3');
			$('#game-badge-name')[0].value = "";
			$('#game-badge-desc')[0].value = "";
			$('#game-badge-feedback')[0].value = "";
			setButtonColor($("#select-badge-requirement").parent());
			var myselect = $("select#select-badge-requirement");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");
			$('#required1').css("color","red");

			$('#game-badge-saved-message').text("");
			$('#game-badge-undo-delete-button').fadeOut();

			$('#game-badge-points')[0].value = "";
			$("#game-badge-points").attr('disabled','disabled');
			$("#game-badge-points").parent().css( "background-color", "#e7e7e7" );
			
			resetGameBadgeEditView();

			setButtonColor($('#showgamebadges'));
			setButtonColor($('#edit-game-badge-button'));
			setButtonColor($('#game-badge-delete-button'));
			setButtonColor($('#game-badge-undo-delete-button'));
			setButtonColor($('#game-badge-save-button'));

		}

		function resetGameBadgeEditView(){ //reset the edit badge view
			$('#edit-game-badge-name')[0].value = "";
			$("#edit-game-badge-name").attr('disabled','disabled');
			$("#edit-game-badge-name").parent().css( "background-color", "#e7e7e7" );
			
			$('#edit-game-badge-desc')[0].value = "";
			$("#edit-game-badge-desc").attr('disabled','disabled');
			$("#edit-game-badge-desc").parent().css( "background-color", "#e7e7e7" );

			$('#edit-game-badge-feedback')[0].value = "";
			$("#edit-game-badge-feedback").attr('disabled','disabled');
			$("#edit-game-badge-feedback").parent().css( "background-color", "#e7e7e7" );

			setButtonColor($("#edit-select-badge-requirement").parent());
			var myselect = $("select#edit-select-badge-requirement");
			myselect[0].selectedIndex = 0;
			myselect.selectmenu("refresh");
			$('#required2').css("color","red");

			$('#edit-game-badge-points')[0].value = "";
			$("#edit-game-badge-points").attr('disabled','disabled');
			$("#edit-game-badge-points").parent().css( "background-color", "#e7e7e7" );
			
			$('#game-badge-save-button').find('*').prop('disabled',true);
			$('#game-badge-save-button').find('*').addClass('ui-disabled');
		}

		function activateGameBadgeEditView(){ //enable all the fields in edit badge view
			$('#edit-game-badge-name').parent().parent().find('*').removeAttr('disabled');
			$('#edit-game-badge-name').parent().parent().find('*').removeClass('ui-disabled');
			$('#edit-game-badge-name').parent().parent().find('*').removeClass('ui-state-disabled');
			$("#edit-game-badge-name").parent().parent().find('*').css( "background-color", "" );
			
			$('#edit-game-badge-desc').parent().parent().find('*').removeAttr('disabled');
			$('#edit-game-badge-desc').parent().parent().find('*').removeClass('ui-disabled');
			$('#edit-game-badge-desc').parent().parent().find('*').removeClass('ui-state-disabled');
			$("#edit-game-badge-desc").parent().parent().find('*').css( "background-color", "" );

			$('#edit-game-badge-feedback').parent().parent().find('*').removeAttr('disabled');
			$('#edit-game-badge-feedback').parent().parent().find('*').removeClass('ui-disabled');
			$('#edit-game-badge-feedback').parent().parent().find('*').removeClass('ui-state-disabled');
			$("#edit-game-badge-feedback").parent().parent().find('*').css( "background-color", "" );

			$('#edit-game-badge-points').parent().parent().find('*').removeAttr('disabled');
			$('#edit-game-badge-points').parent().parent().find('*').removeClass('ui-disabled');
			$('#edit-game-badge-points').parent().parent().find('*').removeClass('ui-state-disabled');
			$("#edit-game-badge-points").parent().parent().find('*').css( "background-color", "" );
			
			$('#game-badge-save-button').find('*').prop('disabled',false);
			$('#game-badge-save-button').find('*').removeClass('ui-disabled');
			
		}

		function setButtonColor(divName){ //set colour to all the buttons in the view
			if (divName.find('*').hasClass('ui-btn-inner')) {
				divName.find('*').css("color",color);
			} 
			else {
				divName.trigger('create');
				divName.find('*').css("color",color);
			}
		}

		function enableGameBadgeCreation(){ //validate the fields and enable the add badge button

			var check = false;

			if($('select[name=select-badge-requirement]').val() != 0){

				if($('select[name=select-badge-requirement]').val() == 1 || $('select[name=select-badge-requirement]').val() == 6 || $('select[name=select-badge-requirement]').val() == 7){
					check = true;
				}else if($.isNumeric($.trim($('#game-badge-points')[0].value))){
					check = true;
				}

			}

			if($.trim($('#game-badge-name')[0].value)!= "" && check){
				$('#uploadGameBadge').prop('disabled',false);
				$('.fileinput-button').css('opacity','1');
			} else{
				$('#uploadGameBadge').prop('disabled',true);
				$('.fileinput-button').css('opacity',0.3);
			}
		}

		function enableGameBadgeSaveButton(){//validate fields and enable the save button


			var check = false;

			if($('select[name=edit-select-badge-requirement]').val() != 0){

				if($('select[name=edit-select-badge-requirement]').val() == 1 || $('select[name=edit-select-badge-requirement]').val() == 6 || $('select[name=edit-select-badge-requirement]').val() == 7){
					check = true;
				}else if($.isNumeric($.trim($('#edit-game-badge-points')[0].value))){
					check = true;
				}

			}

			if($.trim($('#edit-game-badge-name')[0].value)!= "" && check){
				$('#game-badge-save-button').find('*').prop('disabled',false);
				$('#game-badge-save-button').find('*').removeClass('ui-disabled');
			} else{
				$('#game-badge-save-button').find('*').prop('disabled',true);
				$('#game-badge-save-button').find('*').addClass('ui-disabled');
			}
		}

		function getGameBadges(){//get game badges from database

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
						GAME_BADGES = JSON.parse(data);
						populateGameBadges(data);
					}
				});
			}
		}

		function uploadGameBadge(){//save the badge in folder and badge src in database
			var filedata = document.getElementById("uploadGameBadge");
			var badgeName = $.trim($('#game-badge-name')[0].value);
			var badgeDescription = $.trim($('#game-badge-desc')[0].value);
			var badgeFeedbackMessage = $.trim($('#game-badge-feedback')[0].value);
			var badgeRequirementId = $('select[name=select-badge-requirement]').val();
			var requirementValue = $.trim($('#game-badge-points')[0].value);

			if(requirementValue == ""){
				requirementValue = 0;
			}
			
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			var i = 0, len = filedata.files.length, img, reader, file;
			var check = true;
			for (; i < len; i++) {
				file = filedata.files[i];
				
				if(!file.type.match(/image.*/)){
					check = false;
					alert(file.fileName +' is not a valid image!');
					continue;
				}
				i
				if (formdata) {
					formdata.append("uploadGameBadge", file);
				}
			}
			if(check && file){
				formdata.append("badgeName",badgeName);
				formdata.append("badgeDescription",badgeDescription);
				formdata.append("badgeFeedbackMessage",badgeFeedbackMessage);
				formdata.append("badgeRequirementId",badgeRequirementId);
				formdata.append("requirementValue",requirementValue);
				formdata.append("oidcEmail",oidc_userinfo.email);

				if(formdata){
					$.ajax({
						url: "lib/database/uploadGameBadge.php",
						type: "POST",
						data: formdata,
						processData: false,
						contentType: false,
						success: function(data){
							document.getElementById("uploadGameBadge").FileList = {};
							getGameBadges();
							$('#game-badge-saved-message').text("");
							var createBadgeMessage = $('<h2 style="color:#036363;">New Badge added successfully!</h2>');
							$('#game-badge-saved-message').append(createBadgeMessage);
							
							$('#uploadGameBadge').prop('disabled',true);
							$('.fileinput-button').css('opacity','0.3');
							$('#game-badge-name')[0].value = "";
							$('#game-badge-desc')[0].value = "";
							$('#game-badge-feedback')[0].value = "";
							$('#game-badge-points')[0].value = "";
							setButtonColor($("#select-badge-requirement").parent());
							var myselect = $("select#select-badge-requirement");
							myselect[0].selectedIndex = 0;
							myselect.selectmenu("refresh");

						}
					});
				}
			}else{
				document.getElementById("uploadGameBadge").FileList = {};
			}
		}

		function saveGameBadge(badgeSrc){ //save the badge in folder and badge src in database
			
			var badgeName = $.trim($('#edit-game-badge-name')[0].value);
			var badgeDescription = $.trim($('#edit-game-badge-desc')[0].value);
			var badgeFeedbackMessage = $.trim($('#edit-game-badge-feedback')[0].value);
			var badgeRequirementId = $('select[name=edit-select-badge-requirement]').val();
			var requirementValue = $.trim($('#edit-game-badge-points')[0].value);

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			
			if(badgeRequirementId == 1){
				requirementValue = 0;
			}

			formdata.append("badgeSrc",badgeSrc);
			formdata.append("badgeName",badgeName);
			formdata.append("badgeDescription",badgeDescription);
			formdata.append("badgeFeedbackMessage",badgeFeedbackMessage);
			formdata.append("badgeRequirementId",badgeRequirementId);
			formdata.append("requirementValue",requirementValue);

			if(formdata){
				$.ajax({
					url: "lib/database/update_game_badge.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						
						GAME_BADGES[BADGE_INDEX]["badgeName"] = badgeName;
						GAME_BADGES[BADGE_INDEX]["badgeDescription"] = badgeDescription;
						GAME_BADGES[BADGE_INDEX]["badgeFeedbackMessage"] = badgeFeedbackMessage ;
						GAME_BADGES[BADGE_INDEX]["badgeRequirementId"] = badgeRequirementId;
						GAME_BADGES[BADGE_INDEX]["requirementValue"] = requirementValue;
						$('#game-badge-saved-message').text("");
						var saveBadgeMessage = $('<h2 style="color:#036363;">Badge Details saved successfully!</h2>');
						$('#game-badge-saved-message').append(saveBadgeMessage);
						
					}
				});
			}
			
		}

		function addGameBadge(value){//show the badge added

			var length = GAME_BADGES.length - 1;
			var image1 = $('<li email="' +  oidc_userinfo.email + '" class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + GAME_BADGES_PATH + value + '" alt="' +  value + '" width="94" height="68" badgeIndex="'+length+'" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			$('#'+galleryElementName + ' ul').prepend(image1);
			GAME_BADGES[length]["badgeSrc"] = value;
			setGalleryWidth();

		}

		function deleteGameBadge(badgeSrc){//delete the badge from database.
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("badgeSrc",badgeSrc);
			formdata.append("deleted","true");
			LAST_DELETED_GAME_BADGE_SRC = badgeSrc;
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoGameBadge.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
					//alert('success');
					delete GAME_BADGES[BADGE_INDEX];
					$('#game-badge-undo-delete-button').fadeIn();
					$('#edit'+galleryElementName).find(".active").remove();
					$('#edit-game-badge-button').find('*').prop('disabled',true);
					$('#edit-game-badge-button').find('*').addClass('ui-disabled');
					$('#game-badge-delete-button').find('*').prop('disabled',true);
					$('#game-badge-delete-button').find('*').addClass('ui-disabled');
					$('#game-badge-saved-message').text("");
					var badgeSavedMessage = $('<h2 style="color:#036363;">Badge deleted successfully!</h2>');
					$('#game-badge-saved-message').append(badgeSavedMessage);

				}
			});
			}
		}

		
		
		function undoDeleteGameBadge(){//undo badge deletion
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("badgeSrc",LAST_DELETED_GAME_BADGE_SRC);
			formdata.append("deleted","false");
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoGameBadge.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
					//alert('success');
					$('#game-badge-undo-delete-button').fadeOut();
					
					
					getGameBadges();
					$('#game-badge-saved-message').text("");
					var badgeSavedMessage = $('<h2 style="color:#036363;">Badge restored successfully!</h2>');
					$('#game-badge-saved-message').append(badgeSavedMessage);

				}
			});
			}
		}

		function populateGameBadges(filesdata){ //show all badges
			$('#'+galleryElementName + ' ul').children().remove();
			files = JSON.parse(filesdata);
			if(files != null){
				$.each(files, function(index, value) {
					var image1 = $('<li email="' +  value.oidcEmail + '" badgeIndex="'+index+'" class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + GAME_BADGES_PATH + value.badgeSrc + '" alt="' +  value.badgeSrc + '" width="94" height="68" badgeIndex="'+index+'" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
					rand(0,1) ? $('#'+galleryElementName + ' ul').prepend(image1) : $('#' + galleryElementName + ' ul').append(image1);
				});

				setGalleryWidth();
			}
		}

		function reloadDataFromDatabase(){ //load the data from database and then reset the view. This is called when the user clicks to see the this view
			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {
				resetGameBadgeRulesView();
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
