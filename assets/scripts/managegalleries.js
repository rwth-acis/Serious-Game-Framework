//var UPLOADPATH = "uploads/";
var TEMP = "tmp/";


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

		var galleryElementName = "manageGallery";

		var POPULATEGALLERY = $("#"+galleryElementName),
		POPULATEGALLERYul = $("ul", POPULATEGALLERY);

		var GALLERYNAMES;

		
		$('#editgallerieslink').click(function() { 
			resetGalleryView();
		});

		$('#select-gallery').change(function(){
			$('#create-gallery-message').text("");
			$('#gallery-description-message').text("");
			$('#gallery-saved-message').text("");
			var description = $('option:selected', this).attr('description');
			var galleryDescMessage = $('<h2>'+description+'</h2>');
			$('#gallery-description-message').append(galleryDescMessage);
			$('#'+galleryElementName + ' ul').children().remove();
			$('#'+galleryElementName+'wrapper').find('*').prop('disabled',true);
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

		$('#button-edit-gallery').click(function() {
			$('#'+galleryElementName+'wrapper').find('*').prop('disabled',false);
			$('#'+galleryElementName+'wrapper').find('*').removeClass('ui-disabled');
			$('#uploadTiles').prop('disabled',false);
			$('.fileinput-button').css('opacity','1');
			$('#gallery-saved-message').text("");
			$('#create-gallery-message').text("");
			$('#tile-delete-button').find('*').prop('disabled',true);
			$('#tile-delete-button').find('*').addClass('ui-disabled');
			var galleryId = $('select[name=select-gallery]').val();
			getGalleryTiles(galleryId,galleryElementName);
			
		});


		$('#create-gallery-button').click(function() {
			var galleryName = $.trim($('#gallery-name')[0].value);
			var galleryDescription = $.trim($('#gallery-desc')[0].value);
			if(galleryName !=""){
				createGallery(galleryName,galleryDescription);
			}
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
	$('#button-delete-gallery-tile').click(function(){

		$('#create-gallery-message').text("");
		$('#gallery-saved-message').text("");
		var filename = $('#edit'+galleryElementName).find(".active").find(".imgfocus")[0].alt;
		deleteTile(filename);		

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
		getGalleriesList();

	}

	function resetEditGalleryView(){
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
	}

	function createGalleryList(data){
		$('#select-gallery').children().remove();
		$('#select-gallery').append('<option value="'+ 0 +'" description="Select a gallery from the dropdown and click on \'Edit Gallery\' to edit the gallery tiles">--Select Gallery--</option>');
		jsondata = JSON.parse(data);
		if(jsondata != null){
			$.each(jsondata, function(index, value) {
				//if(value.galleryName != "1" && value.galleryName != "2" && value.galleryName != "3" && value.galleryName != "4"){
					$('#select-gallery').append('<option value="'+ value.galleryId +'" description="'+value.galleryDescription+'">' + value.galleryName + '</option>');
				//}
			});
		}
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
					$('#edit'+galleryElementName).find(".active").remove();
					var gallerySavedMessage = $('<h2>Changes to the gallery "'+galleryName+'" are saved successfully!</h2>');
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
					resetEditGalleryView();
					var gallerySavedMessage = $('<h2>Gallery "'+galleryName+'" deleted successfully!</h2>');
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
					resetGalleryView();
					var createGalleryMessage = $('<h2>Gallery with name "'+galleryName+'" is created successfully! Select the gallery from dropdown menu to add tiles to the gallery.</h2>');
					$('#create-gallery-message').append(createGalleryMessage);

				}
			});
		}

	}

	function addTiles(filesdata){
		files = JSON.parse(filesdata);
		if(files != null){
			$.each(files, function(index, value) {
				var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value + '" alt="' +  value + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
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
				var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.tileSrc + '" alt="' +  value.tileSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
				rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
			});

			setGalleryWidth();
		}
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