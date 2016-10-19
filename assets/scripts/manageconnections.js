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

		var galleryElement = "connectionsManage";
		var deleteButtonDiv = "connectionManage-delete-button";
		var deleteButton = "button-delete-connectionManage";
		var galleryTileId = "editconnectionsManage";
		var uploadButtonId = "uploadConnections";
		var showConnectionsButton = "show-connections-Manage";
		var color="#9b319b";

		var LAST_DELETED_CONNECTION_SRC = ""; 


		setGalleryHeight();
		$('.select').find('option').css("height","20px");

		$(window).resize(function() {
			setGalleryHeight();
			setGalleryWidth();
		});

		var CONNECTIONS = $("#"+galleryElement),
		CONNECTIONSul = $("ul", CONNECTIONS);
		
		$('#editconnectionslink').click(function() { //load all the data from database before loading this view
			reloadDataFromDatabase();
		});

		$('#'+galleryTileId).on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
			$('#undo-delete-connection-button').fadeOut();
			var check = false;
			if($(this).attr('email') == oidc_userinfo.email){
				check = true;
			}
			if(GAME_DESIGNERS != undefined && GAME_DESIGNERS.length != 0){ //check admin rights and enable/diable delete connection button
				$.each(GAME_DESIGNERS, function(index, value) {
					if(value.admin == "true" && value.oidcEmail == oidc_userinfo.email){
						check = true;
					}
				});
			}
			if(check){
				$('#connection-saved-message').text("");

				if($(this).hasClass("active")){
					$(this).removeClass("active");
					$('#'+deleteButtonDiv).find('*').prop('disabled',true);
					$('#'+deleteButtonDiv).find('*').addClass('ui-disabled');
				} else {
					$(this).addClass("active");
					$('#'+deleteButtonDiv).find('*').prop('disabled',false);
					$('#'+deleteButtonDiv).find('*').removeClass('ui-disabled');
					$('#'+deleteButtonDiv).css('opacity','1');
				}
				$(this).siblings().removeClass("active");
			}
		});


		$('#'+deleteButton).click(function(){
			$('#connection-saved-message').text("");
			$('#undo-delete-connection-button').fadeOut();
			var filename = $('#'+galleryTileId).find(".active").find(".imgfocus")[0].alt;
			deleteConnection(filename);		
		});

		$('#undo-delete-connection-button').click(function(){
			$('#connection-saved-message').text("");
			$('#undo-delete-connection-button').fadeOut();
			undoDeleteConnection();		
		});


		$('input[id='+uploadButtonId+']').on('change', uploadConnections);
		$('input[id='+uploadButtonId+']').click(function(){
			$('#connection-saved-message').text("");
			$('#undo-delete-connection-button').fadeOut();
		});

		$('#'+showConnectionsButton).click(function(){
			$('#'+galleryElement + ' ul').children().remove();
			$('#undo-delete-connection-button').fadeOut();
			getConnections(galleryElement);

		});


		function resetEditConnectionsView(){ //reset this view
			$('#'+galleryElement + ' ul').children().remove();
			$('#'+deleteButtonDiv).find('*').prop('disabled',true);
			$('#'+deleteButtonDiv).find('*').addClass('ui-disabled');
			$('#connection-saved-message').text("");
			$('.fileinput-button').css('opacity',1);
			$('#undo-delete-connection-button').fadeOut();
			setButtonColor($('#showconnectionsManage'));
			setButtonColor($('#'+deleteButtonDiv));
			setButtonColor($('#undo-delete-connection-button'));
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

		function getConnections(element){ // get connections data from database

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

		function deleteConnection(connectionSrc){ //delete connection from database
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("connectionSrc",connectionSrc);
			formdata.append("deleted","true");
			LAST_DELETED_CONNECTION_SRC = connectionSrc;
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoConnection.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
					//alert('success');
					$('#undo-delete-connection-button').fadeIn();
					$('#'+galleryTileId).find(".active").remove();
					$('#'+deleteButtonDiv).find('*').prop('disabled',true);
					$('#'+deleteButtonDiv).find('*').addClass('ui-disabled');
					$('#connection-saved-message').text("");
					var connectionSavedMessage = $('<h2 style="color:'+color+';">Connection deleted successfully!</h2>');
					$('#connection-saved-message').append(connectionSavedMessage);

				}
			});
			}
		}

			function undoDeleteConnection(){ // undo deletion of connection
			formdata = false;
			if (window.FormData) {
				formdata = new FormData();
			}
			formdata.append("connectionSrc",LAST_DELETED_CONNECTION_SRC);
			formdata.append("deleted","false");
			if(formdata){
				$.ajax({
					url: "lib/database/deleteUndoConnection.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
					//alert('success');
					$('#undo-delete-connection-button').fadeOut();
					
					var image1 = $('<li email="' +  oidc_userinfo.email + '" class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TILES_CONNECTIONS_PATH + LAST_DELETED_CONNECTION_SRC + '" alt="' +  LAST_DELETED_CONNECTION_SRC + '" width="94" height="68" id="piece-id-'+0+'" piece-id="' + 0 + '" piece-count="1" class="imgfocus"/></a></li>');
					$('#'+galleryElement + ' ul').prepend(image1);

					$('#connection-saved-message').text("");
					var connectionSavedMessage = $('<h2 style="color:'+color+';">Connection restored successfully!</h2>');
					$('#connection-saved-message').append(connectionSavedMessage);

				}
			});
			}
		}

		function uploadConnections(){ //upload connection image to the folder and image src to the database
			var filedata = document.getElementById("uploadConnections");
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
					formdata.append(uploadButtonId+"[]", file);
					formdata.append("oidcEmail",oidc_userinfo.email);
				}
			}
			if(check && file){
			if(formdata){
				$.ajax({
					url: "lib/database/uploadConnections.php",
					type: "POST",
					data: formdata,
					processData: false,
					contentType: false,
					success: function(data){
					document.getElementById("uploadConnections").FileList = {};
					addConnections(data);
					var connectionSavedMessage = $('<h2 style="color:'+color+';">Changes to the connections are saved successfully!</h2>');
					$('#connection-saved-message').append(connectionSavedMessage);

				}
			});
			}
		}else{
				document.getElementById("uploadConnections").FileList = {};
			}
		}

		function addConnections(filesdata){ //show added connection
			if(typeof filesdata == 'object'){
				files = filesdata;
			}else{
				files = JSON.parse(filesdata);
			}
			if(files != null){
				$.each(files, function(index, value) {
					var image1 = $('<li email="' +  oidc_userinfo.email + '" class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TILES_CONNECTIONS_PATH + value + '" alt="' +  value + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
					rand(0,1) ? $('#'+galleryElement + ' ul').prepend(image1) : $('#'+galleryElement + ' ul').append(image1);
				});
				setGalleryWidth();
			}

		}

		function populateConnections(element, filesdata){ //show all the existing connections
			$('#'+element + ' ul').children().remove();
			files = JSON.parse(filesdata);
			length = files.length;
			if(files != null){
				$.each(files, function(index, value) {
					var image1 = $('<li email="' +  value.oidcEmail + '" class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TILES_CONNECTIONS_PATH + value.connectionSrc + '" alt="' +  value.connectionSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
					rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
				});
				setGalleryWidth();
			}
		}

		function reloadDataFromDatabase(){ //load all the data from database and reset this view. This function is called when the user clicks to open this view
			var url = "assets/scripts/loadData.js";
			$.getScript( url, function() {
				resetEditConnectionsView();
			});
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
