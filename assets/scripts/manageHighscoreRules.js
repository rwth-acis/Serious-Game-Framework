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

		var color="#c37719";

		var LAST_DELETED_VERSION = ""; 
		var HIGHSCORE_VERSIONS = "";


		setGalleryHeight();
		$('.select').find('option').css("height","20px");

		$(window).resize(function() {
			setGalleryHeight();
			setGalleryWidth();
		});

		
		$('#highscoreruleslink').click(function() { 
			resetHighscoreRulesView();
		});

		$('#select-highscore').change(function(){
			
			$('#save-highscore-rules-message').text("");
			$('#highscore-desc-message').text("");
			var description = $('option:selected', this).attr('description');
			var descMessage = $('<h2 style="color:'+color+';">'+description+'</h2>');
			var highscoreId = $('select[name=select-highscore]').val();
			if(highscoreId == 0){
				$('#highscore-desc-message').append(descMessage);
			}
			
			$('#highscore-undo-delete-button').fadeOut();
			
						
			$('#highscore-save-rules').find('*').prop('disabled',true);
			$('#highscore-save-rules').find('*').addClass('ui-disabled');
			
			if(highscoreId == 0){
				$('#edit-highscore-button').find('*').prop('disabled',true);
			$('#edit-highscore-button').find('*').addClass('ui-disabled');

			$('#delete-button-highscore').find('*').prop('disabled',true);
			$('#delete-button-highscore').find('*').addClass('ui-disabled');

			}
			else{
				$('#edit-highscore-button').find('*').prop('disabled',false);
				$('#edit-highscore-button').find('*').removeClass('ui-disabled');

				$('#delete-button-highscore').find('*').prop('disabled',false);
				$('#delete-button-highscore').find('*').removeClass('ui-disabled');
			}
		});

			$('#button-edit-highscore').click(function() {
			
			$('#save-highscore-rules-message').text("");
			
			$('#highscore-save-rules').find('*').prop('disabled',false);
			$('#highscore-save-rules').find('*').removeClass('ui-disabled');
			
			$('#highscore-undo-delete-button').fadeOut();
			var highscoreIndex = $('select[name=select-highscore]').val();
			getHighscoreVersionDetails(highscoreIndex);
			
			
		});

		function resetHighscoreRulesView(){
			$('#select-highscore').children().remove();
			getHighscoreVersionsList();

			$('#save-highscore-rules-message').text("");
			$('#highscore-desc-message').text("");
			$('#edit-highscore-button').find('*').prop('disabled',true);
			$('#edit-highscore-button').find('*').addClass('ui-disabled');

			$('#delete-button-highscore').find('*').prop('disabled',true);
			$('#delete-button-highscore').find('*').addClass('ui-disabled');

			$('#highscore-save-rules').find('*').prop('disabled',true);
			$('#highscore-save-rules').find('*').addClass('ui-disabled');

			$('#highscore-undo-delete-button').fadeOut();

			$('#highscore-correct')[0].value = "";
			$('#highscore-wrong')[0].value = "";
			$('#highscore-show')[0].value = "";
			$('#highscore-tryagain')[0].value = "";
			$('#highscore-hint')[0].value = "";


			setButtonColor($('#edit-highscore-button'));
			setButtonColor($('#delete-button-highscore'));
			setButtonColor($('#undo-delete-connection-button'));
			setButtonColor($('#highscore-create-rules'));
			setButtonColor($('#highscore-save-rules'));
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

		function getHighscoreVersionsList(){
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

		function createHighscoreVersionsList(){
			$('#select-highscore').children().remove();
			$('#select-highscore').append('<option value="'+ 0 +'" description="Select a highscore version from the dropdown and click on \'Edit Highscore Version\' to edit the details">--Select Highscore Version--</option>');
			jsondata = HIGHSCORE_VERSIONS;

			if(jsondata != null && jsondata != undefined && jsondata.length != 0){
				$.each(jsondata, function(index, value) {
					if(value.oidcEmail == oidc_userinfo.email){
						$('#select-highscore').append('<option value="'+ index +'" description="">' + value.highscoreId + '</option>');
					}
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

		function getHighscoreVersionDetails(highscoreIndex){

			$('#highscore-correct')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["correct"];
			$('#highscore-wrong')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["correct"];
			$('#highscore-show')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["correct"];
			$('#highscore-tryagain')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["correct"];
			$('#highscore-hint')[0].value = HIGHSCORE_VERSIONS[highscoreIndex]["correct"];
		}

		function setGalleryWidth() {
			var connWidth = $('#'+galleryElement).width();
			$('#ulwrap-'+galleryElement).width(connWidth-75);
			CONNECTIONSul.width((102 * CONNECTIONSul.children().length));
			
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
	/*	$('#populateeditlevelswrapper').height(myHeight);
		$('#populateeditlevels').height(wrapperHeight);
		$('#populateeditlevels ul').height(galHeight);*/
		
		//var galWidth = myWidth-280;
		
	}

});	