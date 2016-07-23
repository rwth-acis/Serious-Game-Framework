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


		var BADGES = $("#populatebadges"),
		BADGESul = $("ul", BADGES);

		$('.select').find('option').css("height","20px");

		$(window).resize(function() {
			setGalleryHeight();
			setGalleryWidth();
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

		$('#editbadgeslink').click(function() { 
			resetEditBadgesView();
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
$('#button-delete-badge').click(function(){

	$('#create-badge-message').text("");
	$('#badge-saved-message').text("");
	var filename = $('#editbadge').find(".active").find(".imgfocus")[0].alt;
	deleteBadge(filename);		

});

$('input[id=uploadBadge]').on('change', uploadBadge);
$('input[id=uploadBadge]').click(function(){
	$('#badge-saved-message').text("");
	$('#create-badge-message').text("");
});


$('#show-badges').click(function(){
	$('#populatebadges' + ' ul').children().remove();
	getBadges();
});

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

function addBadge(filesdata){
	files = JSON.parse(filesdata);
	if(files != null){
		$.each(files, function(index, value) {
			var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value + '" alt="' +  value + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			rand(0,1) ? $('#populatebadges' + ' ul').prepend(image1) : $('#populatebadges' + ' ul').append(image1);
		});
		setGalleryWidth();
	}
}

function populateBadges(filesdata){
	$('#populatebadges' + ' ul').children().remove();
	files = JSON.parse(filesdata);
	if(files != null){
		$.each(files, function(index, value) {
			var image1 = $('<li class="ui-widget-content ui-corner-tr piece"><a href="#"><img src="' + TEMP + value.badgeSrc + '" alt="' +  value.badgeSrc + '" width="94" height="68" id="piece-id-'+index+'" piece-id="' + index + '" piece-count="1" class="imgfocus"/></a></li>');
			rand(0,1) ? $('#populatebadges' + ' ul').prepend(image1) : $('#populatebadges' + ' ul').append(image1);
		});

		setGalleryWidth();
	}
}

function setGalleryWidth() {
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
	/*	$('#populateeditlevelswrapper').height(myHeight);
		$('#populateeditlevels').height(wrapperHeight);
		$('#populateeditlevels ul').height(galHeight);*/
		
		//var galWidth = myWidth-280;
		
	}

});	