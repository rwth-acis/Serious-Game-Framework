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

		var galleryElementName = "experienceBadgeGallery";
		var color = "#308f44";

		var POPULATEGALLERY = $("#"+galleryElementName),
		POPULATEGALLERYul = $("ul", POPULATEGALLERY);

		var LAST_DELETED_EXPERIENCE_BADGE_SRC = "";
		var BADGE_INDEX = "";

		getExperienceRules();
		
		$('#experienceruleslink').click(function() { 
			reloadDataFromDatabase();
		});

		$('#experience-badge-name').on('change keyup paste',function() { 
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
			enableBadgeCreation();
		});

		$('#experience-badge-points').on('change keyup paste',function() { 
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
			if(!$.isNumeric($.trim($('#experience-badge-points')[0].value))){
				var createBadgeMessage = $('<h2 style="color:#025814;">Enter numeric value in \'Required Points\' field</h2>');
				$('#create-experience-badge-message').append(createBadgeMessage);
			}
			enableBadgeCreation();
			
		});

		$('#edit-experience-badge-name').on('change keyup paste',function() { 
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
			enableSaveButton();
		});

		$('#edit-experience-badge-points').on('change keyup paste',function() { 
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
			if(!$.isNumeric($.trim($('#edit-experience-badge-points')[0].value))){
				var saveBadgeMessage = $('<h2 style="color:#025814;">Enter numeric value in \'Required Points\' field</h2>');
				$('#experience-badge-saved-message').append(saveBadgeMessage);
			}
			enableSaveButton();
			
		});

		$('#edit'+galleryElementName).on('click', 'li', function() {
			$('#experience-badge-undo-delete-button').fadeOut();
			resetEditView();
			
			BADGE_INDEX = $(this).attr('badgeIndex');
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");

			if($(this).hasClass("active")){
				$(this).removeClass("active");
				
					$('#edit-experience-badge-button').find('*').prop('disabled',true);
					$('#edit-experience-badge-button').find('*').addClass('ui-disabled');
					$('#experience-badge-delete-button').find('*').prop('disabled',true);
					$('#experience-badge-delete-button').find('*').addClass('ui-disabled');
					$('#show-experience-badge-button').find('*').prop('disabled',true);
					$('#show-experience-badge-button').find('*').addClass('ui-disabled');
				

			} else {
				$(this).addClass("active");
				if($(this).attr('email') == oidc_userinfo.email){
					$('#edit-experience-badge-button').find('*').prop('disabled',false);
					$('#edit-experience-badge-button').find('*').removeClass('ui-disabled');
					$('#edit-experience-badge-button').css('opacity','1');
					$('#experience-badge-delete-button').find('*').prop('disabled',false);
					$('#experience-badge-delete-button').find('*').removeClass('ui-disabled');
					$('#experience-badge-delete-button').css('opacity','1');
					$('#show-experience-badge-button').find('*').prop('disabled',true);
					$('#show-experience-badge-button').find('*').addClass('ui-disabled');
				}else{
					$('#edit-experience-badge-button').find('*').prop('disabled',true);
					$('#edit-experience-badge-button').find('*').addClass('ui-disabled');
					$('#experience-badge-delete-button').find('*').prop('disabled',true);
					$('#experience-badge-delete-button').find('*').addClass('ui-disabled');
					$('#show-experience-badge-button').find('*').prop('disabled',false);
					$('#show-experience-badge-button').find('*').removeClass('ui-disabled');
					$('#show-experience-badge-button').css('opacity','1');
				}
			}
			$(this).siblings().removeClass("active");
			
		});
		$('#button-delete-experience-badge').click(function(){
			$('#experience-badge-undo-delete-button').fadeOut();
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
			var filename = $('#edit'+galleryElementName).find(".active").find(".imgfocus")[0].alt;
			deleteExperienceBadge(filename);		

		});

		$('#button-edit-experience-badge').click(function(){
			$('#experience-badge-undo-delete-button').fadeOut();
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");

			activateEditView(true);

			$('#edit-experience-badge-name')[0].value = EXPERIENCE_BADGES[BADGE_INDEX]["badgeName"];
			$('#edit-experience-badge-desc')[0].value = EXPERIENCE_BADGES[BADGE_INDEX]["badgeDescription"];
			$('#edit-experience-badge-feedback')[0].value = EXPERIENCE_BADGES[BADGE_INDEX]["badgeFeedbackMessage"];
			$('#edit-experience-badge-points')[0].value = EXPERIENCE_BADGES[BADGE_INDEX]["score"];		

		});

		$('#button-show-experience-badge').click(function(){
			$('#experience-badge-undo-delete-button').fadeOut();
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");

			activateEditView(false);

			$('#edit-experience-badge-name')[0].value = EXPERIENCE_BADGES[BADGE_INDEX]["badgeName"];
			$('#edit-experience-badge-desc')[0].value = EXPERIENCE_BADGES[BADGE_INDEX]["badgeDescription"];
			$('#edit-experience-badge-feedback')[0].value = EXPERIENCE_BADGES[BADGE_INDEX]["badgeFeedbackMessage"];
			$('#edit-experience-badge-points')[0].value = EXPERIENCE_BADGES[BADGE_INDEX]["score"];		

		});

		$('#experience-badge-save-button').click(function(){
			$('#experience-badge-undo-delete-button').fadeOut();
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
			var filename = $('#edit'+galleryElementName).find(".active").find(".imgfocus")[0].alt;
			saveExperienceBadge(filename);		

		});

		$('#button-undo-delete-experience-badge').click(function(){
			$('#experience-badge-undo-delete-button').fadeOut();
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
			undoDeleteExperienceBadge();		
		});

		$('#button-save-experience-rules').click(function(){
			saveExperienceRules();
		});

		$('input[id=uploadExperienceBadge]').on('change', uploadExperienceBadge);
		$('input[id=uploadExperienceBadge]').click(function(){
			$('#experience-badge-undo-delete-button').fadeOut();
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
		});


		$('#show-experience-badges').click(function(){
			$('#experience-badge-undo-delete-button').fadeOut();
			$('#'+galleryElementName + ' ul').children().remove();
			$('#edit-experience-badge-button').find('*').prop('disabled',true);
			$('#edit-experience-badge-button').find('*').addClass('ui-disabled');
			$('#experience-badge-delete-button').find('*').prop('disabled',true);
			$('#experience-badge-delete-button').find('*').addClass('ui-disabled');
			$('#show-experience-badge-button').find('*').prop('disabled',true);
			$('#show-experience-badge-button').find('*').addClass('ui-disabled');
			getExperienceBadges();
		});

		
		function resetExperienceRulesView(){
			$('#'+galleryElementName + ' ul').children().remove();
			$('#edit-experience-badge-button').find('*').prop('disabled',true);
			$('#edit-experience-badge-button').find('*').addClass('ui-disabled');
			$('#experience-badge-delete-button').find('*').prop('disabled',true);
			$('#experience-badge-delete-button').find('*').addClass('ui-disabled');
			$('#show-experience-badge-button').find('*').prop('disabled',true);
			$('#show-experience-badge-button').find('*').addClass('ui-disabled');
			$('#uploadExperienceBadge').prop('disabled',true);
			$('.fileinput-button').css('opacity','0.3');
			$('#experience-badge-name')[0].value = "";
			$('#experience-badge-desc')[0].value = "";
			$('#experience-badge-feedback')[0].value = "";
			$('#experience-badge-points')[0].value = "";
			$('#create-experience-badge-message').text("");
			$('#experience-badge-saved-message').text("");
			$('#experience-badge-undo-delete-button').fadeOut();
			getExperienceRules();
			resetEditView();

			setButtonColor($('#showexperiencebadges'));
			setButtonColor($('#edit-experience-badge-button'));
			setButtonColor($('#experience-badge-delete-button'));
			setButtonColor($('#experience-save-rules'));
			setButtonColor($('#experience-badge-undo-delete-button'));
			setButtonColor($('#experience-badge-save-button'));
			setButtonColor($('#show-experience-badge-button'));

		}

		function resetEditView(){
			$('#edit-experience-badge-name')[0].value = "";
			$("#edit-experience-badge-name").attr('disabled','disabled');
			$("#edit-experience-badge-name").parent().css( "background-color", "#e7e7e7" );

			$('#edit-experience-badge-desc')[0].value = "";
			$("#edit-experience-badge-desc").attr('disabled','disabled');
			$("#edit-experience-badge-desc").parent().css( "background-color", "#e7e7e7" );

			$('#edit-experience-badge-feedback')[0].value = "";
			$("#edit-experience-badge-feedback").attr('disabled','disabled');
			$("#edit-experience-badge-feedback").parent().css( "background-color", "#e7e7e7" );

			$('#edit-experience-badge-points')[0].value = "";
			$("#edit-experience-badge-points").attr('disabled','disabled');
			$("#edit-experience-badge-points").parent().css( "background-color", "#e7e7e7" );

			$('#experience-badge-save-button').find('*').prop('disabled',true);
			$('#experience-badge-save-button').find('*').addClass('ui-disabled');
		}

		function activateEditView(boolean){
			$('#edit-experience-badge-name').parent().parent().find('*').removeAttr('disabled');
			$('#edit-experience-badge-name').parent().parent().find('*').removeClass('ui-disabled');
			$('#edit-experience-badge-name').parent().parent().find('*').removeClass('ui-state-disabled');
			$("#edit-experience-badge-name").parent().parent().find('*').css( "background-color", "" );

			$('#edit-experience-badge-desc').parent().parent().find('*').removeAttr('disabled');
			$('#edit-experience-badge-desc').parent().parent().find('*').removeClass('ui-disabled');
			$('#edit-experience-badge-desc').parent().parent().find('*').removeClass('ui-state-disabled');
			$("#edit-experience-badge-desc").parent().parent().find('*').css( "background-color", "" );

			$('#edit-experience-badge-feedback').parent().parent().find('*').removeAttr('disabled');
			$('#edit-experience-badge-feedback').parent().parent().find('*').removeClass('ui-disabled');
			$('#edit-experience-badge-feedback').parent().parent().find('*').removeClass('ui-state-disabled');
			$("#edit-experience-badge-feedback").parent().parent().find('*').css( "background-color", "" );

			$('#edit-experience-badge-points').parent().parent().find('*').removeAttr('disabled');
			$('#edit-experience-badge-points').parent().parent().find('*').removeClass('ui-disabled');
			$('#edit-experience-badge-points').parent().parent().find('*').removeClass('ui-state-disabled');
			$("#edit-experience-badge-points").parent().parent().find('*').css( "background-color", "" );
			enableSaveButton(boolean);
			
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

		function enableBadgeCreation(){

			if($.trim($('#experience-badge-name')[0].value)!= "" && $.isNumeric($.trim($('#experience-badge-points')[0].value))){
				$('#uploadExperienceBadge').prop('disabled',false);
				$('.fileinput-button').css('opacity','1');
			} else{
				$('#uploadExperienceBadge').prop('disabled',true);
				$('.fileinput-button').css('opacity',0.3);
			}
		}

		function enableSaveButton(boolean){
			if($.trim($('#edit-experience-badge-name')[0].value)!= "" && $.isNumeric($.trim($('#edit-experience-badge-points')[0].value)) && boolean){
				$('#experience-badge-save-button').find('*').prop('disabled',false);
				$('#experience-badge-save-button').find('*').removeClass('ui-disabled');
			} else{
				$('#experience-badge-save-button').find('*').prop('disabled',true);
				$('#experience-badge-save-button').find('*').addClass('ui-disabled');
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
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						EXPERIENCE_BADGES = JSON.parse(data);
						populateBadges(data);
					}
				});
			}
		}

		function uploadExperienceBadge(){
			var filedata = document.getElementById("uploadExperienceBadge");
			var badgeName = $.trim($('#experience-badge-name')[0].value);
			var badgeDescription = $.trim($('#experience-badge-desc')[0].value);
			var badgeFeedbackMessage = $.trim($('#experience-badge-feedback')[0].value);
			var score = $.trim($('#experience-badge-points')[0].value);
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
				if (formdata) {
					formdata.append("uploadExperienceBadge", file);
				}
			}
			if(check && file){
			formdata.append("badgeName",badgeName);
			formdata.append("badgeDescription",badgeDescription);
			formdata.append("badgeFeedbackMessage",badgeFeedbackMessage);
			formdata.append("score",score);
			formdata.append("oidcEmail",oidc_userinfo.email);

			if(formdata){
				$.ajax({
					url: "lib/database/uploadExperienceBadge.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						document.getElementById("uploadExperienceBadge").FileList = {};
						getExperienceBadges();
						$('#create-experience-badge-message').text("");
						var createBadgeMessage = $('<h2 style="color:#025814;">New Badge added successfully!</h2>');
						$('#create-experience-badge-message').append(createBadgeMessage);
						$('#experience-badge-saved-message').text("");
						$('#uploadExperienceBadge').prop('disabled',true);
						$('.fileinput-button').css('opacity','0.3');
						$('#experience-badge-name')[0].value = "";
						$('#experience-badge-desc')[0].value = "";
						$('#experience-badge-feedback')[0].value = "";
						$('#experience-badge-points')[0].value = "";

					}
				});
			}
		}else{
				document.getElementById("uploadExperienceBadge").FileList = {};
			}
		}

		function saveExperienceBadge(badgeSrc){

			var badgeName = $.trim($('#edit-experience-badge-name')[0].value);
			var badgeDescription = $.trim($('#edit-experience-badge-desc')[0].value);
			var badgeFeedbackMessage = $.trim($('#edit-experience-badge-feedback')[0].value);
			var score = $.trim($('#edit-experience-badge-points')[0].value);

			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			
			formdata.append("badgeSrc",badgeSrc);
			formdata.append("badgeName",badgeName);
			formdata.append("badgeDescription",badgeDescription);
			formdata.append("badgeFeedbackMessage",badgeFeedbackMessage);
			formdata.append("score",score);

			if(formdata){
				$.ajax({
					url: "lib/database/update_experience_badge.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){

						EXPERIENCE_BADGES[BADGE_INDEX]["badgeName"] = badgeName;
						EXPERIENCE_BADGES[BADGE_INDEX]["badgeDescription"] = badgeDescription;
						EXPERIENCE_BADGES[BADGE_INDEX]["badgeFeedbackMessage"] = badgeFeedbackMessage ;
						EXPERIENCE_BADGES[BADGE_INDEX]["score"] = score;
						$('#experience-badge-saved-message').text("");
						var saveBadgeMessage = $('<h2 style="color:#025814;">Badge Details saved successfully!</h2>');
						$('#experience-badge-saved-message').append(saveBadgeMessage);
						$('#create-experience-badge-message').text("");

					}
				});
			}
			
		}

		function saveExperienceRules(){

			var highscore = $.trim($('#experience-highscore')[0].value);
			var elearning = $.trim($('#experience-elearning')[0].value);
			var moreInfo = $.trim($('#experience-moreInfo')[0].value);
			var badges = $.trim($('#experience-badges')[0].value);
			var gamesDesigned = $.trim($('#experience-gamesDesigned')[0].value);
			var noOfLogins = $.trim($('#experience-login')[0].value);

			if(!($.isNumeric(highscore) && $.isNumeric(elearning) && $.isNumeric(moreInfo) && $.isNumeric(badges) && $.isNumeric(gamesDesigned) && $.isNumeric(noOfLogins))){
				$('#save-experience-rules-message').text("");
				var saveRulesMessage = $('<h2 style="color:#025814;">Please enter only numerical values and save again</h2>');
				$('#save-experience-rules-message').append(saveRulesMessage);
			}else{

				formdata = false;
				if (window.FormData) {
					formdata = new FormData();
				}
				formdata.append("ruleId",RULE_ID);
				formdata.append("highscoreFactor",highscore);
				formdata.append("eLearningLinkFactor",elearning);
				formdata.append("moreInformationLinkFactor",moreInfo);
				formdata.append("badgeFactor",badges);
				formdata.append("gamesDesignedFactor",gamesDesigned);
				formdata.append("loginFactor",noOfLogins);
				formdata.append("oidcEmail",oidc_userinfo.email);

				if(formdata){
					$.ajax({
						url: "lib/database/update_experience_rules.php",
						type: "POST",
						data: formdata,
						processData: false,
						contentType: false,
						success: function(data){
							getExperienceRules();
							$('#save-experience-rules-message').text("");
							var saveRulesMessage = $('<h2 style="color:#025814;">Experience Rules saved successfully!</h2>');
							$('#save-experience-rules-message').append(saveRulesMessage);

						}
					});
				}

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
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						EXPERIENCE_RULES = JSON.parse(data);
						if(EXPERIENCE_RULES.length != 0){
							RULE_ID = EXPERIENCE_RULES[0]["ruleId"];
							$('#experience-highscore')[0].value = EXPERIENCE_RULES[0]["highscoreFactor"];
							$('#experience-elearning')[0].value = EXPERIENCE_RULES[0]["eLearningLinkFactor"];
							$('#experience-moreInfo')[0].value = EXPERIENCE_RULES[0]["moreInformationLinkFactor"];
							$('#experience-badges')[0].value = EXPERIENCE_RULES[0]["badgeFactor"];
							$('#experience-gamesDesigned')[0].value = EXPERIENCE_RULES[0]["gamesDesignedFactor"];
							$('#experience-login')[0].value = EXPERIENCE_RULES[0]["loginFactor"];
						}else{
							RULE_ID = 1;
						}
						$('#experienceRulesFormula').text("");
						var rulesMessage = $('<h3 style="color:'+color+';">Experience = Highscore &times; ' +$('#experience-highscore')[0].value+' + No. of eLearningLink Clicks &times; '+$('#experience-elearning')[0].value+' + No. of moreInformation Clicks &times; '+$('#experience-moreInfo')[0].value+' + No. of Badges &times; '+$('#experience-badges')[0].value+' + No. of Games Designed &times; '+$('#experience-gamesDesigned')[0].value+' + No. of times Logged in &times; '+$('#experience-login')[0].value+' </h3>');
						$('#experienceRulesFormula').append(rulesMessage);
						
					}
				});
			}
		}

		function addExperienceBadge(value){

			var length = EXPERIENCE_BADGES.length - 1;
			var image1 = $('<li email="' +  oidc_userinfo.email + '" class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + EXPERIENCE_BADGES_PATH + value + '" alt="' +  value + '" width="94" height="68" badgeIndex="'+length+'" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			$('#'+galleryElementName + ' ul').prepend(image1);
			EXPERIENCE_BADGES[length]["badgeSrc"] = value;
			setGalleryWidth();

		}

		function deleteExperienceBadge(badgeSrc){
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("badgeSrc",badgeSrc);
			formdata.append("deleted","true");
			LAST_DELETED_EXPERIENCE_BADGE_SRC = badgeSrc;
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoExperienceBadge.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
					//alert('success');
					delete EXPERIENCE_BADGES[BADGE_INDEX];
					$('#experience-badge-undo-delete-button').fadeIn();
					$('#edit'+galleryElementName).find(".active").remove();
					$('#edit-experience-badge-button').find('*').prop('disabled',true);
					$('#edit-experience-badge-button').find('*').addClass('ui-disabled');
					$('#experience-badge-delete-button').find('*').prop('disabled',true);
					$('#experience-badge-delete-button').find('*').addClass('ui-disabled');
					$('#experience-badge-saved-message').text("");
					var connectionSavedMessage = $('<h2 style="color:#025814;">Badge deleted successfully!</h2>');
					$('#experience-badge-saved-message').append(connectionSavedMessage);

				}
			});
			}
		}

		
		
		function undoDeleteExperienceBadge(){
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("badgeSrc",LAST_DELETED_EXPERIENCE_BADGE_SRC);
			formdata.append("deleted","false");
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoExperienceBadge.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
					//alert('success');
					$('#experience-badge-undo-delete-button').fadeOut();
					
				//	addExperienceBadge(LAST_DELETED_EXPERIENCE_BADGE_SRC);
				getExperienceBadges();
				$('#experience-badge-saved-message').text("");
				var badgeSavedMessage = $('<h2 style="color:#025814;">Badge restored successfully!</h2>');
				$('#experience-badge-saved-message').append(badgeSavedMessage);

			}
		});
			}
		}

		function populateBadges(filesdata){
			$('#'+galleryElementName + ' ul').children().remove();
			files = JSON.parse(filesdata);
			if(files != null){
				$.each(files, function(index, value) {
					var image1 = $('<li email="' +  value.oidcEmail + '" badgeIndex="'+index+'" class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + EXPERIENCE_BADGES_PATH + value.badgeSrc + '" alt="' +  value.badgeSrc + '" width="94" height="68" badgeIndex="'+index+'" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
					rand(0,1) ? $('#'+galleryElementName + ' ul').prepend(image1) : $('#' + galleryElementName + ' ul').append(image1);
				});

				setGalleryWidth();
			}
		}

		function reloadDataFromDatabase(){
			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {
				resetExperienceRulesView();
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