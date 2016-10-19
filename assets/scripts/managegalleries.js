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

		var galleryElementName = "manageGallery";
		var color = "#333399";

		var POPULATEGALLERY = $("#"+galleryElementName),
		POPULATEGALLERYul = $("ul", POPULATEGALLERY);

		var LAST_DELETED_GALLERY_ID="";
		var LAST_DELETED_TILE_SRC = "";

		
		$('#editgallerieslink').click(function() { 
			resetGalleryView();
		});

		$('#select-gallery').change(function(){
			$('#create-gallery-message').text("");
			$('#gallery-description-message').text("");
			$('#gallery-saved-message').text("");
			var description = $('option:selected', this).attr('description');
			var galleryDescMessage = $('<h2 style="color:'+color+';">'+description+'</h2>');
			var galleryId = $('select[name=select-gallery]').val();
			if(galleryId == 0){
				$('#gallery-description-message').append(galleryDescMessage);
			}
			$('#'+galleryElementName + ' ul').children().remove();
			$('#'+galleryElementName+'wrapper').find('*').prop('disabled',true);
			$('#tile-delete-button').find('*').prop('disabled',true);
			$('#tile-delete-button').find('*').addClass('ui-disabled');
			$('#uploadTiles').prop('disabled',true);
			$('.fileinput-button').css('opacity','0.3');
			$('#edit-gallery-name')[0].value = "";
			$("#edit-gallery-name").attr('disabled','disabled');
			$("#edit-gallery-name").parent().css( "background-color", "#e7e7e7" );
			$('#undo-delete-gallery-button').fadeOut();
			$('#undo-delete-tile-button').fadeOut();
			
			$('#edit-gallery-desc')[0].value = "";
			$("#edit-gallery-desc").attr('disabled','disabled');
			$("#edit-gallery-desc").parent().css( "background-color", "#e7e7e7" );
			
			$('#save-gallery-button').find('*').prop('disabled',true);
			$('#save-gallery-button').find('*').addClass('ui-disabled');
			
			var check  = true;

			if(galleryId == 0){
				check = false;
				$('#show-gallery-button').find('*').prop('disabled',true);
				$('#show-gallery-button').find('*').addClass('ui-disabled');
			}else{
				var email = $('option:selected', $('#select-gallery')).attr('email');
				var checkPermission = false;
				if(email == oidc_userinfo.email){
					checkPermission = true;
				}
				if(GAME_DESIGNERS != undefined && GAME_DESIGNERS.length != 0){
					$.each(GAME_DESIGNERS, function(index, value) {
						if(value.admin == "true" && value.oidcEmail == oidc_userinfo.email){
							checkPermission = true;
						}
					});
				}
				if(!checkPermission){
					check = false;
					$('#show-gallery-button').find('*').prop('disabled',false);
					$('#show-gallery-button').find('*').removeClass('ui-disabled');
				}else{
					$('#show-gallery-button').find('*').prop('disabled',true);
					$('#show-gallery-button').find('*').addClass('ui-disabled');
				}
				
			}

			if(check){
				$('#edit-gallery-button').find('*').prop('disabled',false);
				$('#edit-gallery-button').find('*').removeClass('ui-disabled');

				$('#delete-button-gallery').find('*').prop('disabled',false);
				$('#delete-button-gallery').find('*').removeClass('ui-disabled');

			}
			else{
				$('#edit-gallery-button').find('*').prop('disabled',true);
				$('#edit-gallery-button').find('*').addClass('ui-disabled');

				$('#delete-button-gallery').find('*').prop('disabled',true);
				$('#delete-button-gallery').find('*').addClass('ui-disabled');

			}
		});

		$('#button-edit-gallery').click(function() {
			$('#'+galleryElementName+'wrapper').find('*').prop('disabled',false);
			$('#'+galleryElementName+'wrapper').find('*').removeClass('ui-disabled');
			$('#uploadTiles').prop('disabled',false);
			$('.fileinput-button').css('opacity','1');
			$('#gallery-saved-message').text("");
			$('#create-gallery-message').text("");
			$('#tile-delete-button').find('*').prop('disabled',true);
			$('#tile-delete-button').find('*').addClass('ui-disabled');
			$('#save-gallery-button').find('*').prop('disabled',false);
			$('#save-gallery-button').find('*').removeClass('ui-disabled');
			$('#undo-delete-gallery-button').fadeOut();
			$('#undo-delete-tile-button').fadeOut();
			var galleryId = $('select[name=select-gallery]').val();
			var galleryName = $('#select-gallery :selected').text();
			var galleryDescription = $('#select-gallery :selected').attr('description');
			getGalleryDetails(galleryName,galleryDescription);
			getGalleryTiles(galleryId,galleryElementName);
			
		});

		$('#button-show-gallery').click(function() {

			$('#'+galleryElementName+'wrapper').find('*').prop('disabled',false);
			$('#'+galleryElementName+'wrapper').find('*').removeClass('ui-disabled');
			$('#uploadTiles').prop('disabled',true);
			$('.fileinput-button').css('opacity','0.3');
			$('#gallery-saved-message').text("");
			$('#create-gallery-message').text("");
			$('#tile-delete-button').find('*').prop('disabled',true);
			$('#tile-delete-button').find('*').addClass('ui-disabled');
			$('#save-gallery-button').find('*').prop('disabled',true);
			$('#save-gallery-button').find('*').addClass('ui-disabled');
			$('#undo-delete-gallery-button').fadeOut();
			$('#undo-delete-tile-button').fadeOut();
			var galleryId = $('select[name=select-gallery]').val();
			var galleryName = $('#select-gallery :selected').text();
			var galleryDescription = $('#select-gallery :selected').attr('description');
			getGalleryDetails(galleryName,galleryDescription);
			getGalleryTiles(galleryId,galleryElementName);
			
		});


		$('#create-gallery-button').click(function() {
			var galleryName = $.trim($('#gallery-name')[0].value);
			var galleryDescription = $.trim($('#gallery-desc')[0].value);
			$('#undo-delete-gallery-button').fadeOut();
			$('#undo-delete-tile-button').fadeOut();
			if(galleryName !=""){
				createGallery(galleryName,galleryDescription);
			}
		});

		$('#button-undo-delete-tile').click(function() {
			$('#undo-delete-gallery-button').fadeOut();
			$('#undo-delete-tile-button').fadeOut();
			undoDeleteTile();
		});

		$('#button-undo-delete-gallery').click(function() {
			$('#undo-delete-gallery-button').fadeOut();
			$('#undo-delete-tile-button').fadeOut();
			undoDeleteGallery();
		});

		$('#save-gallery-button').click(function() {
			$('#undo-delete-gallery-button').fadeOut();
			$('#undo-delete-tile-button').fadeOut();
			var galleryName = $.trim($('#edit-gallery-name')[0].value);
			var galleryDescription = $.trim($('#edit-gallery-desc')[0].value);
			var galleryId = $('select[name=select-gallery]').val();
			if(galleryName !=""){
				saveGallery(galleryName,galleryDescription,galleryId);
			}
		});

		$('#reset-gallery-button').click(function() {
			reloadDataFromDatabase();
		});

		$('#gallery-name').on('change keyup paste',function() { 
			$('#create-gallery-message').text("");
			$('#gallery-saved-message').text("");
			var val = $.trim(this.value);
			if(val!= ""){
				$('#create-gallery-button').find('*').prop('disabled',false);
				$('#create-gallery-button').find('*').removeClass('ui-disabled');
			} else{
				$('#create-gallery-button').find('*').prop('disabled',true);
				$('#create-gallery-button').find('*').addClass('ui-disabled');
			}
		});

	$('#edit'+galleryElementName).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property

		var email = $('option:selected', $('#select-gallery')).attr('email');
		var checkPermission = false;
		if(email == oidc_userinfo.email){
			checkPermission = true;
		}
		if(GAME_DESIGNERS != undefined && GAME_DESIGNERS.length != 0){
			$.each(GAME_DESIGNERS, function(index, value) {
				if(value.admin == "true" && value.oidcEmail == oidc_userinfo.email){
					checkPermission = true;
				}
			});
		}
		if(checkPermission){
			$('#create-gallery-message').text("");
			$('#gallery-saved-message').text("");
			$('#undo-delete-gallery-button').fadeOut();
			$('#undo-delete-tile-button').fadeOut();

			if($(this).hasClass("active")){
				$(this).removeClass("active");
				$('#tile-delete-button').find('*').prop('disabled',true);
				$('#tile-delete-button').find('*').addClass('ui-disabled');
			} else {
				$(this).addClass("active");
				$('#tile-delete-button').find('*').prop('disabled',false);
				$('#tile-delete-button').find('*').removeClass('ui-disabled');
				$('#tile-delete-button').css('opacity','1');
			}
			$(this).siblings().removeClass("active");
		}

	});

	$('#button-delete-gallery-tile').click(function(){
		$('#undo-delete-gallery-button').fadeOut();
		$('#undo-delete-tile-button').fadeOut();

		$('#create-gallery-message').text("");
		$('#gallery-saved-message').text("");
		var filename = $('#edit'+galleryElementName).find(".active").find(".imgfocus")[0].alt;
		deleteTile(filename);		

	});


	$('#button-delete-gallery').click(function(){
		$('#undo-delete-gallery-button').fadeOut();
		$('#undo-delete-tile-button').fadeOut();
		$('#gallery-description-message').text("");
		$('#create-gallery-message').text("");
		$('#gallery-saved-message').text("");
		deleteGallery();		
	});

	$('input[id=uploadTiles]').on('change', uploadFile);
	$('input[id=uploadTiles]').click(function(){
		$('#undo-delete-gallery-button').fadeOut();
		$('#undo-delete-tile-button').fadeOut();
		$('#gallery-saved-message').text("");
		$('#create-gallery-message').text("");
	});

	function getGalleriesList(){
		$.ajax({
			url: "lib/database/get_galleries.php",
			type: "GET",
			contentType: false,
			success: function(data){
					//alert(data);
					GALLERYNAMES = JSON.parse(data);
					createGalleryList(GALLERYNAMES);
					
				}
			});
	}

	function resetGalleryView(){
		$('#select-gallery').children().remove();
		$('#'+galleryElementName + ' ul').children().remove();
		$('#'+galleryElementName+'wrapper').find('*').prop('disabled',true);
		$('#tile-delete-button').find('*').prop('disabled',true);
		$('#tile-delete-button').find('*').addClass('ui-disabled');
		$('#uploadTiles').prop('disabled',true);
		$('.fileinput-button').css('opacity','0.3');
		$('#create-gallery-button').find('*').prop('disabled',true);
		$('#create-gallery-button').find('*').addClass('ui-disabled');
		$('#gallery-name')[0].value = "";
		$('#gallery-desc')[0].value = "";
		$('#create-gallery-message').text("");
		$('#gallery-saved-message').text("");
		$('#gallery-description-message').text("");
		$('#edit-gallery-button').find('*').prop('disabled',true);
		$('#edit-gallery-button').find('*').addClass('ui-disabled');
		$('#delete-button-gallery').find('*').prop('disabled',true);
		$('#delete-button-gallery').find('*').addClass('ui-disabled');
		$('#show-gallery-button').find('*').prop('disabled',true);
		$('#show-gallery-button').find('*').addClass('ui-disabled');

		$('#edit-gallery-name')[0].value = "";
		$("#edit-gallery-name").attr('disabled','disabled');
		$("#edit-gallery-name").parent().css( "background-color", "#e7e7e7" );
		
		$('#edit-gallery-desc')[0].value = "";
		$("#edit-gallery-desc").attr('disabled','disabled');
		$("#edit-gallery-desc").parent().css( "background-color", "#e7e7e7" );
		
		$('#save-gallery-button').find('*').prop('disabled',true);
		$('#save-gallery-button').find('*').addClass('ui-disabled');

		$('#undo-delete-gallery-button').fadeOut();
		$('#undo-delete-tile-button').fadeOut();

		setButtonColor($('#tile-delete-button'));
		setButtonColor($('#edit-gallery-button'));
		setButtonColor($('#create-gallery-button'));
		setButtonColor($('#delete-button-gallery'));
		setButtonColor($('#reset-gallery-button'));
		setButtonColor($('#save-gallery-button'));
		setButtonColor($('#undo-delete-gallery-button'));
		setButtonColor($('#undo-delete-tile-button'));
		setButtonColor($('#show-gallery-button'));
		getGalleriesList();

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

	/*function resetEditGalleryView(){
		$('#select-gallery').children().remove();
		$('#'+galleryElementName + ' ul').children().remove();
		$('#'+galleryElementName+'wrapper').find('*').prop('disabled',true);
		$('#tile-delete-button').find('*').prop('disabled',true);
		$('#tile-delete-button').find('*').addClass('ui-disabled');
		$('#uploadTiles').prop('disabled',true);
		$('.fileinput-button').css('opacity','0.3');
		$('#create-gallery-message').text("");
		$('#gallery-saved-message').text("");
		$('#gallery-description-message').text("");
		$('#edit-gallery-button').find('*').prop('disabled',true);
		$('#edit-gallery-button').find('*').addClass('ui-disabled');
		$('#delete-button-gallery').find('*').prop('disabled',true);
		$('#delete-button-gallery').find('*').addClass('ui-disabled');
		getGalleriesList();
	}*/

	function createGalleryList(data){
		$('#select-gallery').children().remove();
		$('#select-gallery').append('<option value="'+ 0 +'" description="Select a gallery from the dropdown and click on \'Edit Gallery\' to edit the gallery tiles">--Select Gallery--</option>');
		jsondata = data;
		
		if(jsondata != null && jsondata != undefined && jsondata.length != 0){
			$.each(jsondata, function(index, value) {
				if(value.galleryName != "1" && value.galleryName != "2" && value.galleryName != "3" && value.galleryName != "4"){
					$('#select-gallery').append('<option value="'+ value.galleryId +'" email="'+value.oidcEmail+'" description="'+value.galleryDescription+'">' + value.galleryName + '</option>');
				}
			});
		}
		setButtonColor($("#select-gallery").parent());
		var myselect = $("select#select-gallery");
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
		$('#gallery-description-message').text("");
		var description = $('option:selected', $('#select-gallery')).attr('description');
		var galleryDescMessage = $('<h2 style="color:'+color+';">'+description+'</h2>');
		$('#gallery-description-message').append(galleryDescMessage);
		$('#edit-gallery-button').find('*').prop('disabled',true);
		$('#edit-gallery-button').find('*').addClass('ui-disabled');

		$('#delete-button-gallery').find('*').prop('disabled',true);
		$('#delete-button-gallery').find('*').addClass('ui-disabled');
		
	}

	function getGalleryDetails(galleryName,galleryDescription){

		$('#edit-gallery-name').parent().parent().find('*').removeAttr('disabled');
		$('#edit-gallery-name').parent().parent().find('*').removeClass('ui-disabled');
		$('#edit-gallery-name').parent().parent().find('*').removeClass('ui-state-disabled');
		$("#edit-gallery-name").parent().parent().find('*').css( "background-color", "" );
		
		$('#edit-gallery-desc').parent().parent().find('*').removeAttr('disabled');
		$('#edit-gallery-desc').parent().parent().find('*').removeClass('ui-disabled');
		$('#edit-gallery-desc').parent().parent().find('*').removeClass('ui-state-disabled');
		$("#edit-gallery-desc").parent().parent().find('*').css( "background-color", "" );


		$('#edit-gallery-name')[0].value = galleryName;
		$('#edit-gallery-desc')[0].value = galleryDescription;

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


	function deleteTile(tileSrc){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		//var galleryId = $('select[name=select-gallery]').val();
		var galleryName = $('#select-gallery :selected').text();
		formdata.append("deleted","true");
		formdata.append("tileSrc",tileSrc);
		LAST_DELETED_TILE_SRC = tileSrc;
		if(formdata){
			$.ajax({
				url: "lib/database/deleteUndoGalleryTile.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					
					$('#undo-delete-tile-button').fadeIn();
					$('#edit'+galleryElementName).find(".active").remove();
					$('#gallery-saved-message').text("");
					var gallerySavedMessage = $('<h2 style="color:'+color+';">Changes to the gallery "'+galleryName+'" are saved successfully!</h2>');
					$('#gallery-saved-message').append(gallerySavedMessage);

				}
			});
		}

	}

	function undoDeleteTile(){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		//var galleryId = $('select[name=select-gallery]').val();
		var galleryName = $('#select-gallery :selected').text();
		formdata.append("deleted","false");
		formdata.append("tileSrc",LAST_DELETED_TILE_SRC);
		if(formdata){
			$.ajax({
				url: "lib/database/deleteUndoGalleryTile.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					
					$('#undo-delete-tile-button').fadeOut();
					var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TILES_CONNECTIONS_PATH + LAST_DELETED_TILE_SRC + '" alt="' +  LAST_DELETED_TILE_SRC + '" width="94" height="68" id="piece-id-'+0+'" piece-id="' + 1 + '" piece-count="1" class="imgfocus"/></a></li>');
					$('#'+galleryElementName + ' ul').prepend(image1);
					
					$('#gallery-saved-message').text("");
					var gallerySavedMessage = $('<h2 style="color:'+color+';">Changes to the gallery "'+galleryName+'" are saved successfully!</h2>');
					$('#gallery-saved-message').append(gallerySavedMessage);

				}
			});
		}

	}

	function deleteGallery(){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		var galleryName = $('#select-gallery :selected').text();
		var galleryId = $('select[name=select-gallery]').val();
		LAST_DELETED_GALLERY_NAME = $('#select-gallery :selected').text();
		LAST_DELETED_GALLERY_ID = galleryId;
		formdata.append("galleryId",galleryId);
		formdata.append("deleted","true");
		if(formdata){
			$.ajax({
				url: "lib/database/deleteUndoGallery.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					
					resetGalleryView();
					$('#gallery-saved-message').text("");
					var gallerySavedMessage = $('<h2 style="color:'+color+';">Gallery "'+galleryName+'" deleted successfully!</h2>');
					$('#gallery-saved-message').append(gallerySavedMessage);
					$('#undo-delete-gallery-button').fadeIn();
				}
			});
		}
	}

	function undoDeleteGallery(){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		
		formdata.append("galleryId",LAST_DELETED_GALLERY_ID);
		formdata.append("deleted","false");
		if(formdata){
			$.ajax({
				url: "lib/database/deleteUndoGallery.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					$('#undo-delete-gallery-button').fadeOut();
					resetGalleryView();
					$('#gallery-saved-message').text("");
					var gallerySavedMessage = $('<h2 style="color:'+color+';">Gallery "'+LAST_DELETED_GALLERY_NAME+'" restored successfully!</h2>');
					$('#gallery-saved-message').append(gallerySavedMessage);
					
				}
			});
		}
	}

	function uploadFile(){
		var filedata = document.getElementById("uploadTiles");
		var galleryId = $('select[name=select-gallery]').val();
		var galleryName = $('#select-gallery :selected').text();
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
				formdata.append("uploadTiles[]", file);
			}
		}
		if(check && file){
			formdata.append("galleryId",galleryId);

			if(formdata){
				$.ajax({
					url: "lib/database/uploadTiles.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
						document.getElementById("uploadTiles").FileList = {};
						addTiles(data);
						$('#gallery-saved-message').text("");
						var gallerySavedMessage = $('<h2 style="color:'+color+';">Changes to the gallery "'+galleryName+'" are saved successfully!</h2>');
						$('#gallery-saved-message').append(gallerySavedMessage);

					}
				});
			}
		}else{
			document.getElementById("uploadTiles").FileList = {};
		}
	}

	function createGallery(galleryName,galleryDescription){

		var duplicate = "false";

		if(GALLERYNAMES != null && GALLERYNAMES != undefined && GALLERYNAMES.length != 0){
			$.each(GALLERYNAMES, function(index, value) {
				if(value.galleryName == galleryName){
					duplicate = "true";
					var ans = confirm("Gallery with name "+galleryName+ " already exists. Do you still want to proceed?");
					if (ans == true) {
						createGalleryConfirm(galleryName,galleryDescription);
					}
				}
				
			});
		}

		if(duplicate == "false"){
			createGalleryConfirm(galleryName,galleryDescription);
		}

	}

	function saveGallery(galleryName,galleryDescription,galleryId){

		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		formdata.append("galleryName",galleryName);
		formdata.append("galleryDescription",galleryDescription);
		formdata.append("galleryId",galleryId);
		if(formdata){
			$.ajax({
				url: "lib/database/update_gallery.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					resetGalleryView();
					var saveGalleryMessage = $('<h2 style="color:'+color+';">Gallery "'+galleryName+'" is saved successfully!</h2>');
					$('#gallery-saved-message').append(saveGalleryMessage);

				}
			});
		}

	}

	function createGalleryConfirm(galleryName,galleryDescription){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		formdata.append("galleryName",galleryName);
		formdata.append("galleryDescription",galleryDescription);
		formdata.append("oidcEmail",oidc_userinfo.email);
		if(formdata){
			$.ajax({
				url: "lib/database/create_gallery.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					resetGalleryView();
					var createGalleryMessage = $('<h2 style="color:'+color+';">Gallery with name "'+galleryName+'" is created successfully! Select the gallery from dropdown menu to add tiles to the gallery.</h2>');
					$('#create-gallery-message').append(createGalleryMessage);

				}
			});
		}

	}

	function addTiles(filesdata){
		files = JSON.parse(filesdata);
		if(files != null){
			$.each(files, function(index, value) {
				var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TILES_CONNECTIONS_PATH + value + '" alt="' +  value + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
				rand(0,1) ? $('#'+galleryElementName + ' ul').prepend(image1) : $('#'+galleryElementName + ' ul').append(image1);
			});
			setGalleryWidth();
		}

	}

	function populateGallery(element, filesdata){
		$('#'+element + ' ul').children().remove();
		files = JSON.parse(filesdata);
		if(files != null){
			$.each(files, function(index, value) {
				var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TILES_CONNECTIONS_PATH + value.tileSrc + '" alt="' +  value.tileSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
				rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
			});

			setGalleryWidth();
		}
	}

	function refreshGamesAndGalleries(){
		var url = "assets/scripts/loadData.js";
		$.getScript( url, function() {
			resetGalleryView();
		});
	}

	function reloadDataFromDatabase(){
		var url = "assets/scripts/loadData.js";
		$.getScript( url, function() {
			resetGalleryView();
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