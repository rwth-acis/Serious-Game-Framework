var UPLOADPATH = "uploads/";
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

		var CONNECTIONS = $("#populateconnections"),
		CONNECTIONSul = $("ul", CONNECTIONS);
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

		$('#editconnectionslink').click(function() { 
			resetEditConnectionsView();
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


		$('#button-delete-connection').click(function(){
			$('#connection-saved-message').text("");
			var filename = $('#editconnection').find(".active").find(".imgfocus")[0].alt;
			deleteConnection(filename);		
		});


		$('input[id=uploadConnections]').on('change', uploadConnections);
		$('input[id=uploadConnections]').click(function(){
			$('#connection-saved-message').text("");
		});

		$('#show-connection').click(function(){
			$('#populateconnections' + ' ul').children().remove();
			getConnections("populateconnections");
		});


		function resetEditConnectionsView(){
			$('#populateconnections' + ' ul').children().remove();
			$('#connection-delete-button').find('*').prop('disabled',true);
			$('#connection-delete-button').find('*').addClass('ui-disabled');
			$('#connection-saved-message').text("");
			$('.fileinput-button').css('opacity',1);
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
			$('#'+element + ' ul').children().remove();
			files = JSON.parse(filesdata);
			length = files.length;
			$.each(files, function(index, value) {
				var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.connectionSrc + '" alt="' +  value.connectionSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
				rand(0,1) ? $('#'+element + ' ul').prepend(image1) : $('#'+element + ' ul').append(image1);
			});
			setGalleryWidth();
		}

		function setGalleryWidth() {
			var connWidth = $('#populateconnections').width();
			$('#ulwrap-populateconnections').width(connWidth-75);
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