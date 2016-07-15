var UPLOADPATH = "uploads/";
var TEMP = "tmp/";
var DEBUG = false;

// 0: very easy (only one piece left to fill)
// 1: easy (only two pieces left to fill)
// 2: medium (user chooses first piece; system gives one other piece)
// 3: hard (free game)
// 4: very hard (one random piece will be shown and the user has to pick the missing ones IMPLEMENTED
var DIFFICULTY = 3;
var NEWDIFFICULTY = 3;

var GAMEID = -1;

var GOTDATA = false;
var GAMESDATA;
var LEVELDATA;
var PIECESDATA;
var CONNECTIONSDATA;

var SETSOFPIECES;

var NEXTLEVELS = [];
var LEVELSDONE = [];
var CURRENTLEVEL = -1;
var GAMESTATE = "leveldone";

function rand(min, max) {
	if (!DEBUG) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
			// disable random value for debugging
			return min;
		}
	}

	$(document).ready(function() {

		$.ajax({
			url: "lib/database/db_create.php",
			type: "GET",
			contentType: false,
			success: function(data){
					//alert(data);
				}
			});

		setGalleryHeight();

		var POPULATEGALLERY = $("#populategallery"),
		POPULATEGALLERYul = $("ul", POPULATEGALLERY);

		var CONNECTIONS = $("#populateconnections"),
		CONNECTIONSul = $("ul", CONNECTIONS);

		var CONNECTIONS2 = $("#populateconnections2"),
		CONNECTIONS2ul = $("ul", CONNECTIONS2);

		var BADGES = $("#populatebadges"),
		BADGESul = $("ul", BADGES);

		var GALLERYNAMES;

		$('.select').find('option').css("height","20px"); 

		$('#button-right-populategallery').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategallery').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategallery').stop();
			}
		});

		$('#button-left-populategallery').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populategallery').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populategallery').stop();
			}
		});

		$('#button-right-populateconnections').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populateconnections').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populateconnections').stop();
			}
		});

		$('#button-left-populateconnections').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populateconnections').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populateconnections').stop();
			}
		});

		$('#button-right-populatebadges').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populatebadges').animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populatebadges').stop();
			}
		});

		$('#button-left-populatebadges').bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-populatebadges').animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-populatebadges').stop();
			}
		});

		$(window).resize(function() {
			setGalleryHeight();
			setGalleryWidth();
		});

		$('#editgallerieslink').click(function() { 
			resetEditGalleryView();
		});

		$('#editconnectionslink').click(function() { 
			resetEditConnectionsView();
		});

		$('#editbadgeslink').click(function() { 
			resetEditBadgesView();
		});

		$('#creategameslink').click(function() { 
			resetGameCreationView();
		});

		$('#select-gallery').change(function(){
			$('#create-gallery-message').text("");
			$('#gallery-description-message').text("");
			$('#gallery-saved-message').text("");
			var description = $('option:selected', this).attr('description');
			var galleryDescMessage = $('<h2>'+description+'</h2>');
			$('#gallery-description-message').append(galleryDescMessage);
			$('#populategallery' + ' ul').children().remove();
			$('#populategallerywrapper').find('*').prop('disabled',true);
			$('#tile-delete-button').find('*').prop('disabled',true);
			$('#tile-delete-button').find('*').addClass('ui-disabled');
			$('#uploadTiles').prop('disabled',true);
			$('.fileinput-button').css('opacity','0.3');
			var galleryId = $('select[name=select-gallery]').val();
			if(galleryId == 0){
				$('#edit-gallery-button').find('*').prop('disabled',true);
				$('#edit-gallery-button').find('*').addClass('ui-disabled');

				$('#delete-button-gallery').find('*').prop('disabled',true);
				$('#delete-button-gallery').find('*').addClass('ui-disabled');
			}
			else{
				$('#edit-gallery-button').find('*').prop('disabled',false);
				$('#edit-gallery-button').find('*').removeClass('ui-disabled');

				$('#delete-button-gallery').find('*').prop('disabled',false);
				$('#delete-button-gallery').find('*').removeClass('ui-disabled');
			}
		});

		$('#gallerycount').change(function(){
			$('#create-game-message').text("");
			var galleryId = $('select[name=gallerycount]').val();
			if(galleryId < 2){
				$('#selectgallery1fieldset').addClass('hideElement');
				$('#selectgallery2fieldset').addClass('hideElement');
				$('#selectgallery3fieldset').addClass('hideElement');
				$('#selectgallery4fieldset').addClass('hideElement');
				$('#selectconnection-fieldset').addClass('hideElement');
				$('#create-game-button').find('*').prop('disabled',true);
				$('#create-game-button').find('*').addClass('ui-disabled');
				var createGameMessage = $('<h2>To enable game creation, give non-empty game name and select the number of galleries to be added in the game</h2>');
				$('#create-game-message').append(createGameMessage);
				
			} else{
				$('#selectconnection-fieldset').removeClass('hideElement');
				getConnections("populateconnections2");
				if(galleryId >= 2){
					$('#selectgallery1fieldset').removeClass('hideElement');
					$('#selectgallery2fieldset').removeClass('hideElement');
					$('#selectgallery3fieldset').addClass('hideElement');
					$('#selectgallery4fieldset').addClass('hideElement');
				}
				if(galleryId > 2){
					$('#selectgallery3fieldset').removeClass('hideElement');
					$('#selectgallery4fieldset').addClass('hideElement');
				}
				if(galleryId > 3){
					$('#selectgallery4fieldset').removeClass('hideElement');
				}
				var createGameMessage = $('<h2>To enable game creation, give non-empty game name and select galleries and connection</h2>');
				$('#create-game-message').append(createGameMessage);
			}
			
			enableCreateGameButton();
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

		$('#button-edit-gallery').click(function() {
			$('#populategallerywrapper').find('*').prop('disabled',false);
			$('#populategallerywrapper').find('*').removeClass('ui-disabled');
			$('#uploadTiles').prop('disabled',false);
			$('.fileinput-button').css('opacity','1');
			$('#gallery-saved-message').text("");
			$('#create-gallery-message').text("");
			$('#tile-delete-button').find('*').prop('disabled',true);
			$('#tile-delete-button').find('*').addClass('ui-disabled');
			getGalleryTiles();
			
		});

		$('#create-gallery-button').click(function() {
			var galleryName = $.trim($('#gallery-name')[0].value);
			var galleryDescription = $.trim($('#gallery-desc')[0].value);
			if(galleryName !=""){
				createGallery(galleryName,galleryDescription);
			}
		});

		$('#create-game-button').click(function() {
			createGame();
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

		$('#badge-name').on('change keyup paste',function() { 
			$('#create-badge-message').text("");
			$('#badge-saved-message').text("");
			var val = $.trim(this.value);
			if(val!= ""){
				$('#uploadBadge').prop('disabled',false);
				$('.fileinput-button').css('opacity','1');
			} else{
				$('#uploadBadge').prop('disabled',true);
				$('.fileinput-button').css('opacity',0.3);
			}
		});

		$('#gallery-name').on('change keyup paste',function() { 
			enableCreateGameButton();
		});

	$('#editgallery').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		$('#create-gallery-message').text("");
		$('#gallery-saved-message').text("");

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

	});

		$('#editconnection').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
			$('#connection-saved-message').text("");

			if($(this).hasClass("active")){
				$(this).removeClass("active");
				$('#connection-delete-button').find('*').prop('disabled',true);
				$('#connection-delete-button').find('*').addClass('ui-disabled');
			} else {
				$(this).addClass("active");
				$('#connection-delete-button').find('*').prop('disabled',false);
				$('#connection-delete-button').find('*').removeClass('ui-disabled');
				$('#connection-delete-button').css('opacity','1');
			}
			$(this).siblings().removeClass("active");

		});

		$('#editconnection2').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
			
			if($(this).hasClass("active")){
				$(this).removeClass("active");
				
			} else {
				$(this).addClass("active");
			}
			$(this).siblings().removeClass("active");
			enableCreateGameButton();

		});


		
	$('#editbadge').on('click', 'li', function() { // id of clicked li by directly accessing DOMElement property
		$('#create-badge-message').text("");
		$('#badge-saved-message').text("");

		if($(this).hasClass("active")){
			$(this).removeClass("active");
			$('#badge-delete-button').find('*').prop('disabled',true);
			$('#badge-delete-button').find('*').addClass('ui-disabled');
		} else {
			$(this).addClass("active");
			$('#badge-delete-button').find('*').prop('disabled',false);
			$('#badge-delete-button').find('*').removeClass('ui-disabled');
			$('#badge-delete-button').css('opacity','1');
		}
		$(this).siblings().removeClass("active");

	});

	$('#button-delete-gallery-tile').click(function(){

		$('#create-gallery-message').text("");
		$('#gallery-saved-message').text("");
		var filename = $('#editgallery').find(".active").find(".imgfocus")[0].alt;
		deleteTile(filename);		
		
	});


	$('#button-delete-badge').click(function(){

		$('#create-badge-message').text("");
		$('#badge-saved-message').text("");
		var filename = $('#editbadge').find(".active").find(".imgfocus")[0].alt;
		deleteBadge(filename);		
		
	});

	$('#button-delete-connection').click(function(){
		$('#connection-saved-message').text("");
		var filename = $('#editconnection').find(".active").find(".imgfocus")[0].alt;
		deleteConnection(filename);		
	});

	$('#button-delete-gallery').click(function(){
		$('#gallery-description-message').text("");
		$('#create-gallery-message').text("");
		$('#gallery-saved-message').text("");
		deleteGallery();		
	});

	$('input[id=uploadTiles]').on('change', uploadFile);
	$('input[id=uploadTiles]').click(function(){
		$('#gallery-saved-message').text("");
		$('#create-gallery-message').text("");
	});

	$('input[id=uploadBadge]').on('change', uploadBadge);
	$('input[id=uploadBadge]').click(function(){
		$('#badge-saved-message').text("");
		$('#create-badge-message').text("");
	});

	$('input[id=uploadConnections]').on('change', uploadConnections);
	$('input[id=uploadConnections]').click(function(){
		$('#connection-saved-message').text("");
	});

	$('#show-connection').click(function(){
		$('#populateconnections' + ' ul').children().remove();
		getConnections("populateconnections");
	});

	$('#show-badges').click(function(){
		$('#populatebadges' + ' ul').children().remove();
		getBadges();
	});
	function getGalleriesList(){
		$.ajax({
			url: "lib/database/get_galleries.php",
			type: "GET",
			contentType: false,
			success: function(data){
					//alert(data);
					GALLERYNAMES = data;
					if(GALLERYNAMES != 'NULL'){
						createGalleryList(GALLERYNAMES);
					}
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

	function resetEditGalleryView(){
		$('#select-gallery').children().remove();
		$('#populategallery' + ' ul').children().remove();
		$('#populategallerywrapper').find('*').prop('disabled',true);
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
		getGalleriesList();

	}

	function resetEditBadgesView(){
		
		$('#populatebadges' + ' ul').children().remove();
		$('#badge-delete-button').find('*').prop('disabled',true);
		$('#badge-delete-button').find('*').addClass('ui-disabled');
		$('#uploadBadge').prop('disabled',true);
		$('.fileinput-button').css('opacity','0.3');
		$('#badge-name')[0].value = "";
		$('#badge-desc')[0].value = "";
		$('#create-badge-message').text("");
		$('#badge-saved-message').text("");
	}

	function resetEditConnectionsView(){
		$('#populateconnections' + ' ul').children().remove();
		$('#connection-delete-button').find('*').prop('disabled',true);
		$('#connection-delete-button').find('*').addClass('ui-disabled');
		$('#connection-saved-message').text("");
		$('.fileinput-button').css('opacity',1);
	}

	function resetGameCreationView(){
		$('#game-name')[0].value = "";
		$('#game-desc')[0].value = "";
		$('#gallerycount').children().remove();
		$('#gallerycount').append('<option value="'+ 1 +'" description="Select number of galleries to be added in the game">--Select Galleries Count--</option>');
		$('#gallerycount').append('<option value="'+ 2 +'" >2</option>');
		$('#gallerycount').append('<option value="'+ 3 +'" >3</option>');
		$('#gallerycount').append('<option value="'+ 4 +'" >4</option>');
		$('#selectgallery1fieldset').addClass('hideElement');
		$('#selectgallery2fieldset').addClass('hideElement');
		$('#selectgallery3fieldset').addClass('hideElement');
		$('#selectgallery4fieldset').addClass('hideElement');
		$('#selectconnection-fieldset').addClass('hideElement');
		$('#create-game-button').find('*').prop('disabled',true);
		$('#create-game-button').find('*').addClass('ui-disabled');
		getGalleriesList2("selectgallery1");
		getGalleriesList2("selectgallery2");
		getGalleriesList2("selectgallery3");
		getGalleriesList2("selectgallery4");
		$('#create-game-message').text("");
		var createGameMessage = $('<h2>To enable game creation, give non-empty game name and select the number of galleries to be added in the game</h2>');
		$('#create-game-message').append(createGameMessage);
		var myselect = $("select#gallerycount");
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
		
	}

	function enableCreateGameButton(){
		var galleryCountVal = $('select[name=gallerycount]').val();
		var gallery1Val = $('select[name=selectgallery1]').val();
		var gallery2Val = $('select[name=selectgallery2]').val();
		var gallery3Val = $('select[name=selectgallery3]').val();
		var gallery4Val = $('select[name=selectgallery4]').val();
		var validSelector = "false";
		if(galleryCountVal == 2){
			if(gallery1Val != 0 && gallery2Val != 0){
				validSelector = "true";
			}else{
				validSelector = "false";
			}
		}
		if(galleryCountVal == 3){
			if(gallery1Val != 0 && gallery2Val != 0 && gallery3Val != 0){
				validSelector = "true";
			}else{
				validSelector = "false";
			}
		}
		if(galleryCountVal == 4){
			if(gallery1Val != 0 && gallery2Val != 0 && gallery3Val != 0 && gallery4Val != 0){
				validSelector = "true";
			}else{
				validSelector = "false";
			}
		}
		$('#create-game-message').text("");
		var val = $.trim($('#game-name')[0].value);
		if(val != "" && $('#editconnection2').find('*').hasClass("active") && validSelector == "true"){
			$('#create-game-button').find('*').prop('disabled',false);
			$('#create-game-button').find('*').removeClass('ui-disabled');
			var createGameMessage = $('<h2>Click on "Create" to create the game</h2>');
			$('#create-game-message').append(createGameMessage);
		}else{
			var createGameMessage = $('<h2>To enable game creation, give non-empty game name and select galleries and connection</h2>');
			$('#create-game-message').append(createGameMessage);
			$('#create-game-button').find('*').prop('disabled',true);
			$('#create-game-button').find('*').addClass('ui-disabled');
		}
	}

	function createGalleryList(data){
		$('#select-gallery').children().remove();
		$('#select-gallery').append('<option value="'+ 0 +'" description="Select a gallery from the dropdown and click on \'Edit Gallery\' to edit the gallery tiles">--Select Gallery--</option>');
		jsondata = JSON.parse(data);
		$.each(jsondata, function(index, value) {
			$('#select-gallery').append('<option value="'+ value.galleryId +'" description="'+value.galleryDescription+'">' + value.galleryName + '</option>');
		});

		var myselect = $("select#select-gallery");
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
		$('#gallery-description-message').text("");
		var description = $('option:selected', $('#select-gallery')).attr('description');
		var galleryDescMessage = $('<h2>'+description+'</h2>');
		$('#gallery-description-message').append(galleryDescMessage);
		$('#edit-gallery-button').find('*').prop('disabled',true);
		$('#edit-gallery-button').find('*').addClass('ui-disabled');

		$('#delete-button-gallery').find('*').prop('disabled',true);
		$('#delete-button-gallery').find('*').addClass('ui-disabled');
	}

	function createGalleryList2(element, data){
		$('#'+element).children().remove();
		$('#'+element).append('<option value="'+ 0 +'" description="Select a gallery from the dropdown and click on \'Edit Gallery\' to edit the gallery tiles">--Select Gallery--</option>');
		jsondata = JSON.parse(data);
		$.each(jsondata, function(index, value) {
			$('#'+element).append('<option value="'+ value.galleryId +'" description="'+value.galleryDescription+'">' + value.galleryName + '</option>');
		});

		var myselect = $("select#"+element);
		myselect[0].selectedIndex = 0;
		myselect.selectmenu("refresh");
	}
	function getGalleryTiles(){

		var galleryId = $('select[name=select-gallery]').val();
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
					populateGallery(data);
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

	function getBadges(){

		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		if(formdata){
			$.ajax({
				url: "lib/database/get_badges.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					populateBadges(data);
				}
			});
		}
	}

	function deleteTile(tileSrc){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		var galleryId = $('select[name=select-gallery]').val();
		var galleryName = $('#select-gallery :selected').text();
		formdata.append("galleryId",galleryId);
		formdata.append("tileSrc",tileSrc);
		if(formdata){
			$.ajax({
				url: "lib/database/deleteTile.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					$('#editgallery').find(".active").remove();
					var gallerySavedMessage = $('<h2>Changes to the gallery "'+galleryName+'" are saved successfully!</h2>');
					$('#gallery-saved-message').append(gallerySavedMessage);

				}
			});
		}

	}

	function deleteConnection(connectionSrc){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		formdata.append("connectionSrc",connectionSrc);
		if(formdata){
			$.ajax({
				url: "lib/database/deleteConnection.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					$('#editconnection').find(".active").remove();
					$('#connection-delete-button').find('*').prop('disabled',true);
					$('#connection-delete-button').find('*').addClass('ui-disabled');
					var connectionSavedMessage = $('<h2>Changes to the connections are saved successfully!</h2>');
					$('#connection-saved-message').append(connectionSavedMessage);

				}
			});
		}

	}

	function deleteBadge(badgeSrc){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		formdata.append("badgeSrc",badgeSrc);
		if(formdata){
			$.ajax({
				url: "lib/database/deleteBadge.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					$('#editbadge').find(".active").remove();
					$('#badge-delete-button').find('*').prop('disabled',true);
					$('#badge-delete-button').find('*').addClass('ui-disabled');
					var badgeSavedMessage = $('<h2>Changes to the badges are saved successfully!</h2>');
					$('#badge-saved-message').append(badgeSavedMessage);

				}
			});
		}

	}

	function deleteGallery(){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		var galleryId = $('select[name=select-gallery]').val();
		var galleryName = $('#select-gallery :selected').text();
		formdata.append("galleryId",galleryId);
		if(formdata){
			$.ajax({
				url: "lib/database/deleteGallery.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					var gallerySavedMessage = $('<h2>Gallery "'+galleryName+'" deleted successfully!</h2>');
					$('#gallery-saved-message').append(gallerySavedMessage);
					getGalleriesList();
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
		for (; i < len; i++) {
			file = filedata.files[i];
			if(!file.type.match(/image.*/)){
				alert(file.fileName +' is not a valid image!');
				continue;
			}
			if (formdata) {
				formdata.append("uploadTiles[]", file);
			}
		}
		formdata.append("galleryId",galleryId);

		if(formdata){
			$.ajax({
				url: "lib/database/uploadTiles.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					addTiles(data);
					var gallerySavedMessage = $('<h2>Changes to the gallery "'+galleryName+'" are saved successfully!</h2>');
					$('#gallery-saved-message').append(gallerySavedMessage);
					
				}
			});
		}
	}

	function uploadConnections(){
		var filedata = document.getElementById("uploadConnections");
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		var i = 0, len = filedata.files.length, img, reader, file;
		for (; i < len; i++) {
			file = filedata.files[i];
			if(!file.type.match(/image.*/)){
				alert(file.fileName +' is not a valid image!');
				continue;
			}
			if (formdata) {
				formdata.append("uploadConnections[]", file);
			}
		}
		
		if(formdata){
			$.ajax({
				url: "lib/database/uploadConnections.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					addConnections(data);
					var connectionSavedMessage = $('<h2>Changes to the connections are saved successfully!</h2>');
					$('#connection-saved-message').append(connectionSavedMessage);

				}
			});
		}
	}

	function uploadBadge(){
		var filedata = document.getElementById("uploadBadge");
		var badgeName = $.trim($('#badge-name')[0].value);
		var badgeDescription = $.trim($('#badge-desc')[0].value);
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		var i = 0, len = filedata.files.length, img, reader, file;
		for (; i < len; i++) {
			file = filedata.files[i];
			if(!file.type.match(/image.*/)){
				alert(file.fileName +' is not a valid image!');
				continue;
			}
			if (formdata) {
				formdata.append("uploadBadge", file);
			}
		}
		formdata.append("badgeName",badgeName);
		formdata.append("badgeDescription",badgeDescription);
		if(formdata){
			$.ajax({
				url: "lib/database/uploadBadge.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					//alert('success');
					addBadge(data);
					var createBadgeMessage = $('<h2>New Badge added successfully!</h2>');
					$('#create-badge-message').append(createBadgeMessage);
					$('#badge-saved-message').text("");
					$('#uploadBadge').prop('disabled',true);
					$('.fileinput-button').css('opacity','0.3');
					$('#badge-name')[0].value = "";
					$('#badge-desc')[0].value = "";

				}
			});
		}
	}

	function createGallery(galleryName,galleryDescription){
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		formdata.append("galleryName",galleryName);
		formdata.append("galleryDescription",galleryDescription);
		if(formdata){
			$.ajax({
				url: "lib/database/create_gallery.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					resetEditGalleryView();
					var createGalleryMessage = $('<h2>Gallery with name "'+galleryName+'" is created successfully! Select the gallery from dropdown menu to add tiles to the gallery.</h2>');
					$('#create-gallery-message').append(createGalleryMessage);

				}
			});
		}

	}

	function createGame(){
		var gameName = $.trim($('#game-name')[0].value);
		var gameDescription = $.trim($('#game-desc')[0].value);
		var gallery1Id = $('select[name=selectgallery1]').val();
		var gallery2Id = $('select[name=selectgallery2]').val();
		var gallery3Id = $('select[name=selectgallery3]').val();
		var gallery4Id = $('select[name=selectgallery4]').val();
		var connectionSrc = $('#editconnection2').find(".active").find(".imgfocus")[0].alt;
		formdata = false;
		if (window.FormData) {
			formdata = new FormData();
		}
		formdata.append("gameName",gameName);
		formdata.append("gameDescription",gameDescription);
		formdata.append("gallery1Id",gallery1Id);
		formdata.append("gallery2Id",gallery2Id);
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
		formdata.append("connectionSrc",connectionSrc);
		if(formdata){
			$.ajax({
				url: "lib/database/create_game.php",
				type: "POST",
				data: formdata,
				processData: false,
				contentType: false,
				success: function(data){
					resetGameCreationView();
					var createGameMessage = $('<h2>Game with name "'+gameName+'" is created successfully! Go to \'Edit Games\' menu to add levels to the game.</h2>');
					$('#create-game-message').append(createGameMessage);

				}
			});
		}

	}

	function addTiles(filesdata){
		files = JSON.parse(filesdata);
		$.each(files, function(index, value) {
			var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value + '" alt="' +  value + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			rand(0,1) ? $('#populategallery' + ' ul').prepend(image1) : $('#populategallery' + ' ul').append(image1);
		});
		setGalleryWidth();
		
		
	}
	function populateGallery(filesdata){
		files = JSON.parse(filesdata);
		$.each(files, function(index, value) {
			var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.tileSrc + '" alt="' +  value.tileSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			rand(0,1) ? $('#populategallery' + ' ul').prepend(image1) : $('#populategallery' + ' ul').append(image1);
		});

		setGalleryWidth();
	}

	function addBadge(filesdata){
		files = JSON.parse(filesdata);
		$.each(files, function(index, value) {
			var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value + '" alt="' +  value + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			rand(0,1) ? $('#populatebadges' + ' ul').prepend(image1) : $('#populatebadges' + ' ul').append(image1);
		});
		setGalleryWidth();
	}

	function populateBadges(filesdata){
		files = JSON.parse(filesdata);
		$.each(files, function(index, value) {
			var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.badgeSrc + '" alt="' +  value.badgeSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			rand(0,1) ? $('#populatebadges' + ' ul').prepend(image1) : $('#populatebadges' + ' ul').append(image1);
		});

		setGalleryWidth();
	}

	function addConnections(filesdata){
		if(typeof filesdata == 'object'){
			files = filesdata;
		}else{
			files = JSON.parse(filesdata);
		}
		$.each(files, function(index, value) {
			var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value + '" alt="' +  value + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			rand(0,1) ? $('#populateconnections' + ' ul').prepend(image1) : $('#populateconnections' + ' ul').append(image1);
		});
		setGalleryWidth();
		
		
	}
	function populateConnections(element, filesdata){
		files = JSON.parse(filesdata);
		length = files.length;
		$.each(files, function(index, value) {
			var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.connectionSrc + '" alt="' +  value.connectionSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
		});
		setGalleryWidth();
	}

	function setGalleryWidth() {
		var galWidth = $('#populategallery').width();
		$('#ulwrap-populategallery').width(galWidth-75);
		POPULATEGALLERYul.width((102 * POPULATEGALLERYul.children().length));

		var connWidth = $('#populateconnections').width();
		$('#ulwrap-populateconnections').width(connWidth-75);
		CONNECTIONSul.width((102 * CONNECTIONSul.children().length));

		var connWidth2 = $('#populateconnections2').width();
		$('#ulwrap-populateconnections2').width(connWidth2-75);
		CONNECTIONS2ul.width((102 * CONNECTIONS2ul.children().length));

		var badgeWidth = $('#populatebadges').width();
		$('#ulwrap-populatebadges').width(badgeWidth-75);
		BADGESul.width((102 * BADGESul.children().length));
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
		
		//var galWidth = myWidth-280;
		
	}

});	

/*function getSetsOfPieces() {
	// AJAX Requests only when Client is online
	if (navigator.onLine) {
		var ajaxerror = false;
		// Load JSON file with level information
		$.ajax({
			'async': false,
			'global': false,
			'url': 'getJSONSetsOfPieces.php',
			'dataType': "json",
			'success': function(data) {
				SETSOFPIECES = data;
			},
			'error': function(xhr, error) {
				ajaxerror = true;
			}
		});
	}
}

function getGamesData() {
	// AJAX Requests only when Client is online
	if (navigator.onLine) {
		var ajaxerror = false;
		// Load JSON file with level information
		$.ajax({
			'async': false,
			'global': false,
			'url': 'testdata/games.json',
			'dataType': "json",
			'success': function(data) {
				GAMESDATA = data;
			},
			'error': function(xhr, error) {
				ajaxerror = true;
			}
		});
	}
}

function getLevelData() {
	// AJAX Requests only when Client is online
	if (navigator.onLine) {
		// Load JSON file with level information
		$.ajax({
			'async': false,
			'global': false,
			'url': 'testdata/levels.json',
			'dataType': "json",
			'success': function(data) {
				LEVELDATA = data;
			},
			'error': function(xhr, error) {
				ajaxerror = true;
			}
		});
	}
}

function getPiecesData() {
	// AJAX Requests only when Client is online
	if (navigator.onLine) {
		// Load JSON file with pieces information
		$.ajax({
			'async': false,
			'global': false,
			'url': 'testdata/pieces.json',
			'dataType': "json",
			'success': function(data) {
				PIECESDATA = data;
			},
			'error': function(xhr, error) {
				ajaxerror = true;
			}
		});
	}
}
	
function getConnectionsData() {
	// AJAX Requests only when Client is online
	if (navigator.onLine) {
		// Load JSON file with connections information
		$.ajax({
			'async': false,
			'global': false,
			'url': 'testdata/connections.json',
			'dataType': "json",
			'success': function(data) {
				CONNECTIONSDATA = data;
			},
			'error': function(xhr, error) {
				ajaxerror = true;
			}
		});
	}
}*/


// When DOM is loaded do the following
/*$(document).ready(function(){
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
	
	
	
	
	$('.gamelink').click(function(){
		var gameID = $(this).attr('game-id');
		GAMEID = gameID;
		loadGame(GAMEID);
	});
	
	$('#button-newpieces').click(function(){
		getSetsOfPieces();
		
		$('#select-setOfPieces-1').empty();
		// fill the listview
		fillSetsOfPiecesList(SETSOFPIECES);
		
		$('#FileInput-Pieces').val("");
		$('#uploadPieceList').empty();
	});
	
	function fillSetsOfPiecesList(setsData) {
		$.each(setsData, function(i, data) {
			// i: gameID
			// data: gameData
			//alert(i + " - " + JSON.stringify(data));
			//var game = $('<a class="ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-right ui-btn-up-c" game-id="' + i + '" data-transition="slide" data-iconpos="right" data-icon="arrow-r" data-role="button" href="#game" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c">' + data.name + '</a>');
			
			var listitem = $('<option value="' + data.id + '">' + data.description + '</option>');
			$('#select-setOfPieces-1').append(listitem);
		});
		$('#select-setOfPieces-1').selectmenu();
        $('#select-setOfPieces-1').selectmenu('refresh', true);
	}
	
	$('#button-submit-uploadpieces').click(function(){
		var proceed = true;
		// TODO: do some checks here whether the file should be accepted and whether a file was selected.
		if (proceed) {
			// collect input data
			//alert($('#select-setOfPieces-1').val());
			//alert("File: " + $('#FileInput-Pieces').val() );
			
			var file = $('#FileInput-Pieces')[0].files[0];
			////alert(file.name);
			//var reader = new FileReader();
			//reader.readAsBinaryString(file);
			//reader.onload = function(event){
			//	
			//	var result = event.target.result;
			//	
			//	post_data = {
			//		'setId'		: $('#select-setOfPieces-1').val(),
			//		'fileName'	: file.name,
			//		'data'		: result
			//	};
			//	
			//	alert( JSON.stringify(post_data) );
			//	
			//	$.post('processPieceUpload.php', post_data, function(response){  
			//		alert(response);
			//	}, 'json');
			//};
			
			$.ajax({
				url: "processPieceUpload.php",
				type: "POST",
				data: file,
				processData: false,
				contentType: false
			});
		}
	});
	
	$('#button-games').click(function(){
		getGamesData();
		fillGamesList(GAMESDATA);
	});
	
	
	/////
	// Upload Piece
	var uploadPieceUl = $('#uploadPiece ul');
	
	// Initialize the jQuery File Upload plugin
    $('#uploadPiece').fileupload({

        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {

			var tpl = $('<li class="working"><img src="assets/images/Actions-edit-delete-icon.png" class="ui-li-icon" /><p><strong class="filename"></strong></p><p class="filesize"></p><div class="progressbar"><div class="progress-label">Loading...</div></div></li>');
			
            // Append the file name and file size
            tpl.find('.filename').text(data.files[0].name);
			tpl.find('.filesize').text(formatFileSize(data.files[0].size));

            // Add the HTML to the UL element
            data.context = tpl.appendTo(uploadPieceUl);
			
			uploadPieceUl.listview( "refresh" );

            // Initialize the progressbar
            var progressbar = tpl.find('.progressbar'),
				progressLabel = tpl.find('.progress-label');
			progressbar.progressbar({
				value: false,
				change: function() {
					progressLabel.text( progressbar.progressbar( "value" ) + "%" );
				},
				complete: function() {
					progressLabel.text( "Complete!" );
				}
			});

            // Listen for clicks on the cancel icon
            tpl.find('img').click(function(){

                if(tpl.hasClass('working')){
                    jqXHR.abort();
                }

                tpl.fadeOut(function(){
                    tpl.remove();
					uploadPieceUl.listview( "refresh" );
                });
            });

            // Automatically upload the file once it is added to the queue
            var jqXHR = data.submit();
        },

        progress: function(e, data){

            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);
			
            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('.progressbar').progressbar( "option", {
				value: progress
			});

            if(progress == 100){
                data.context.removeClass('working');
				data.context.find('img').attr("src", "assets/images/Actions-dialog-ok-apply-icon.png");
            }
        },

        fail:function(e, data){
            // Something has gone wrong!
            data.context.addClass('error');
			data.contect.find('.progress-label').text('Error');
        }

    });

    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

	
	/////
	
	function fillGamesList(gamesData) {
		$.each(gamesData, function(i, data) {
			// i: gameID
			// data: gameData
			//alert(i + " - " + data.name);
			//var game = $('<a class="ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-right ui-btn-up-c" game-id="' + i + '" data-transition="slide" data-iconpos="right" data-icon="arrow-r" data-role="button" href="#game" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c">' + data.name + '</a>');
			
			var game = $('<li ><a href="#editgame" game-id="' + i + '" class="gamelink"><h3>' + data.name + '</h3><p>' + data.description + '</p></a><a href="#deletegame" data-rel="dialog">delete</a></li>');
			$('.gameslist').append(game);
		});
		$('.gameslist').listview('refresh');
	}
	
	function loadGame(gameID) {
		if (gameID > -1) {
			$('.gametitle').empty().append(GAMESDATA[gameID].name);
			clearGalleries();
			initializeLevelState()
			loadGaleries(gameID);
			initializeDragDrop();
			clearGameboard();
			nextLevel();
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
	}*/
	

	/** 
	  * Fills the four galleries with data
	  * @param gameID The ID of the current game.
	  */
/*	function loadGaleries( gameID ) {
		var pieceCounter = new Array();
		
		$.each(LEVELDATA, function(i, data) {
			// i: levelID
			// data: level data
			if (data.game_id == gameID) {
				rand(0,1) ? NEXTLEVELS.push(i) : NEXTLEVELS.unshift(i);
				$.each(data.pieces, function(j, p) {
					// j: index of piece [1,4]
					// p: piece id
					if (p >= 0) {
						if (pieceCounter[p]) {
							pieceCounter[p]++;
							$('img[piece-id=' + p + ']', '#gallery' + j + ' ul').attr('piece-count',pieceCounter[p]);
							
						} else {
							var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><img src="' + UPLOADPATH + PIECESDATA[p].src + '" alt="' + PIECESDATA[p].description + '" width="96" height="72" piece-id="' + p + '" piece-count="1" /></li>');
							rand(0,1) ? $('#gallery' + j + ' ul').prepend(image1) : $('#gallery' + j + ' ul').append(image1);
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
	}*/
	
	/** 
	  * Returns a random number in the interval [min,max]
	  * @param min Minimum value of the interval.
	  * @param max Maximum value of the interval.
	  */
	/*function rand(min, max) {
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
		makeGalleriesDroppable
	}
	
	// let the galleries items be draggable
	function makeGalleriesDraggable() {
		$( "li", GALLERIES ).draggable({
			revert: "invalid", // when not dropped, the item will revert back to its initial position
			containment: "document",
			helper: "clone",
			cursor: "move"
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
	}*/
	
	/** 
	  * This function moves a piece from the gallery to a given slot.
	  * @param piece The piece that should be moved.
	  * @param slotID The ID of the slot where the piece should be moved.
	  * @param galleryID The ID of the gallery where the piece should be deleted.
	  */
	/*function movePieceToSlot( piece, slotID, galleryID ) {
		//alert(slotID + " - " + galleryID);
		var slot = $('#slot' + slotID);
		var gallery = $('#gallery' + galleryID);
		var list = $( "li", slot );
		if (!list.length) {
			piece.fadeOut(function() {
				piece.appendTo( slot ).fadeIn(verifyLevel());
			});
		} else {
			list.fadeOut(function() {
				list.appendTo( $("ul",gallery) ).fadeIn(verifyLevel());
			});
			piece.fadeOut(function() {
				piece.appendTo( slot ).fadeIn(verifyLevel());
			});
		}
	}*/
	
	/** 
	  * This function moves a pieces from a slot back to the gallery.
	  * @param piece The piece that should be moved.
	  * @param galleryID The ID of the gallery where the piece should be dropped.
	  */
	/*function movePieceToGallery( piece, slotID ) {
		var gallery = $('#gallery' + slotID);
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
				res = findBestFittingLevel();
				break;
		}
		CURRENTLEVEL = res;
		return res;
	}
	
	function findBestFittingLevel() {
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
			
			
			$('#button-showme').hide();
			$('#button-next').hide();
			$('.level-verification').hide();
			$('#elearning').hide().empty();
			
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
	}*/
	
	/** 
	  * This function verifies the current level. For this it first calls the function allSlotsFilled() to check whether all slots are filled.
	  */
	/*function verifyLevel() {
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
				//alert("returned: " + l + " old: " + oldLevel + " current: " + CURRENTLEVEL);
				// old idea: verify images on source
				//var src1 = $("img", slot0).attr('src').replace(UPLOADPATH,'');
				//var src2 = $("img", slot1).attr('src').replace(UPLOADPATH,'');
				//var src3 = $("img", slot2).attr('src').replace(UPLOADPATH,'');
				//var src4 = $("img", slot3).attr('src').replace(UPLOADPATH,'');
				
				// Store the index of the pieces in variables
				var p = [-1,-1,-1,-1];
				
				p[0] = $("img", slot0).attr('piece-id')
				p[1] = $("img", slot1).attr('piece-id')
				p[2] = $("img", slot2).attr('piece-id')
				p[3] = $("img", slot3).attr('piece-id')
				
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
					//alert("Structure OK");
					if ( 	((LEVELDATA[l].pieces[0] == p[0]) || (LEVELDATA[l].pieces[0] == -1)) 
						&& 	((LEVELDATA[l].pieces[1] == p[1]) || (LEVELDATA[l].pieces[1] == -1))
						&& 	((LEVELDATA[l].pieces[2] == p[2]) || (LEVELDATA[l].pieces[2] == -1))
						&& 	((LEVELDATA[l].pieces[3] == p[3]) || (LEVELDATA[l].pieces[3] == -1)) ) {
						correct = true;
					}
					
					GAMESTATE = "leveldone";
					$('#button-showme').hide();
					$('#elearning').show();
					if (LEVELDATA[l].elearning) {
						$('#elearning').append('<a href="' + LEVELDATA[l].elearning + '" target="_blank">E-Learning Link</a>');
					}
					
					if (!correct) {
						// Tell the user that the solution is wrong
						$('#level-verification-wrong').show();
					} else {
						// Tell the user that the solution is correct
						$('#level-verification-correct').show();
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
						blockSlot(slot,false);
					}
					
					var levelIndex = $.inArray(l,NEXTLEVELS);
					NEXTLEVELS.splice(levelIndex, 1);
					
					if (correct) {
						$('#button-next').show();
						$('#button-next').click(function() {
							nextLevel();
						});
					} else {
						// ToDo: no timeOut, but show Show Me Button!
						timeoutID = window.setTimeout(function(){showCorrectSolution(correct)}, 2000);
					}
					
					// Check if all levels completed
					if (allGalleriesEmpty()) {
						$('ul', '#levelcontrol').append('<li>All levels done.</li>');
					} else {
						
					}
					
					// next level should be started with a button!
					// user input should be displayed with marked what was right and what wrong, then the correct solution
					
					
					setGalleryWidth();
					
				} else {
					//alert("Structure nicht OK");
				}
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
						movePieceToSlot( piece2, j, j )
						blockSlot(s, false);
						blockPiece(piece2);
					}(i, l, piece, slot);
				}
			}
		}
		
		if (!correct) {
			$('#button-next').show();
			$('#button-next').click(function() {
				nextLevel();
			});
		}
		setGalleryWidth();
	}*/
	
	/** 
	  * Returns true if all slots are filled.
	  * NOT REALLY NEEDED ANYMORE
	  */
	/*function allSlotsFilled() {
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
	

});*/
