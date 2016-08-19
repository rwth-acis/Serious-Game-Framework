$(document).ready(function() {

	function createHeader(headerName, appendFactor, elementAppend){
		
		var $inner1 = $("<div/>", {"data-role":"header", "data-theme":"b"}),
		$inner2a = $("<div>", {"data-inline":"true"}),
		$inner3a = $("<a/>", {href:"https://goo.gl/forms/CqFAHaOIkC1GPHwi2", target:"_blank", class:"ui-btn-right", "data-inline":"true", "data-role":"button", text:"Feedback"}),
		$inner3b = $("<a/>", {href:"#", "data-icon":"arrow-l", class:"ui-btn-left", "data-inline":"true", "data-role":"button", "data-iconpos":"notext", "data-rel":"back", text:"Home"}),
		$inner2b = $("<h2/>", {text:headerName});

		if(appendFactor){
			$inner1.append($inner2a.append($inner3a,$inner3b),$inner2b).appendTo(elementAppend);
		}else{
			$inner1.append($inner2a.append($inner3a,$inner3b),$inner2b).prependTo(elementAppend);
		}

	}

	function createSlot(divId, slotId, appendFactor, elementAppend){
		var $inner1 = $("<td/>"),
		$inner2 = $("<div/>" , {id:divId, class:"wrapperslot"}),
		$inner3 = $("<ul/>" , {id:slotId, class:"slot ui-widget-content ui-state-default"});

		if(appendFactor){
			$inner1.append($inner2.append($inner3)).appendTo(elementAppend);
		}else{
			$inner1.append($inner2.append($inner3)).prependTo(elementAppend);
		}

	}

	function createConnection(divId, appendFactor, elementAppend){
		var $inner1 = $("<td/>"),
		$inner2 = $("<div/>", {id:divId, class:"connection"});

		if(appendFactor){
			$inner1.append($inner2).appendTo(elementAppend);
		}else{
			$inner1.append($inner2).prependTo(elementAppend);
		}

	}

	function createGameBoardButton(spanId, buttonId, dataTheme, elementText, appendFactor, elementAppend){
		var $inner1 = $("<span/>", {id:spanId}),
		$inner2 = $("<button/>", {id:buttonId, "data-theme":dataTheme, "data-mini":"false", text:elementText});

		if(appendFactor){
			$inner1.append($inner2).appendTo(elementAppend);
		}else{
			$inner1.append($inner2).prependTo(elementAppend);
		}
	}

	function createLevelVerificationElement(headerId, elementText, appendFactor, elementAppend){
		var $inner1 = $("<h3/>", {id:headerId, class:"level-verification", text:elementText});

		if(appendFactor){
			$inner1.appendTo(elementAppend);
		}else{
			$inner1.prependTo(elementAppend);
		}
	}

	function createParagraphElement(elementId, appendFactor, elementAppend){
		var $inner1 = $("<p/>", {id:elementId});

		if(appendFactor){
			$inner1.appendTo(elementAppend);
		}else{
			$inner1.prependTo(elementAppend);
		}
	}


	function createHorizontalGalleryUI(elementName, appendFactor, elementAppend){

		var $inner1 = $("<div/>", { id: elementName+"wrapper", class:"horizontalgallerywrapper" }),
		$inner2 = $("<div/>", { id: elementName, class: "gallery ui-helper-reset ui-helper-clearfix"}),
		$inner3a = $("<h4/>", { id: "header-"+elementName, class: "ui-widget-header"}),
		$inner3b = $("<span/>", { id:"button-left-"+elementName, class:"button-left"}),
		$inner3b4 = $("<button/>", { "data-icon":"arrow-l", "data-iconshadow":"false", "data-inline":"false", "data-mini":"false", "data-iconpos":"notext", class:"ui-icon-alt", text:"&nbsp;"}),
		$inner3c = $("<span/>", { id:"ulwrap-"+elementName}),
		$inner3c4 = $("<ul/>", { id:"edit"+elementName}),
		$inner3d = $("<span/>", { id:"button-right-"+elementName, class:"button-right"}),
		$inner3d4 = $("<button/>", { "data-icon":"arrow-r", "data-iconshadow":"false", "data-inline":"false", "data-mini":"false", "data-iconpos":"notext", class:"ui-icon-alt", text: "&nbsp;"});

		if(appendFactor){
			$inner1.append($inner2.append($inner3a, $inner3b.append($inner3b4), $inner3c.append($inner3c4), $inner3d.append($inner3d4))).appendTo(elementAppend);
		}else{
			$inner1.append($inner2.append($inner3a, $inner3b.append($inner3b4), $inner3c.append($inner3c4), $inner3d.append($inner3d4))).prependTo(elementAppend);
		}

	}

	function createVerticalGalleryUI(elementName, appendFactor, elementAppend){

		var $inner1 = $("<div/>", { id: elementName+"wrapper"}),
		$inner2 = $("<div/>", { id: elementName, class: "gallery ui-helper-reset ui-helper-clearfix"}),
		$inner3a = $("<h4/>", { id: "header-"+elementName, class: "ui-widget-header", text:"1"}),
		$inner3b = $("<span/>", { id:"button-up-"+elementName, class:"button-up"}),
		$inner3b4 = $("<button/>", { "data-icon":"arrow-u", "data-iconshadow":"false", "data-inline":"false", "data-mini":"false", "data-iconpos":"notext", class:"ui-icon-alt", text:"&nbsp;"}),
		$inner3c = $("<ul/>"),
		$inner3d = $("<span/>", { id:"button-down-"+elementName, class:"button-down"}),
		$inner3d4 = $("<button/>", { "data-icon":"arrow-d", "data-iconshadow":"false", "data-inline":"false", "data-mini":"false", "data-iconpos":"notext", class:"ui-icon-alt", text: "&nbsp;"});

		if(appendFactor){
			$inner1.append($inner2.append($inner3a, $inner3b.append($inner3b4), $inner3c, $inner3d.append($inner3d4))).appendTo(elementAppend);
		}else{
			$inner1.append($inner2.append($inner3a, $inner3b.append($inner3b4), $inner3c, $inner3d.append($inner3d4))).prependTo(elementAppend);
		}

	}	

	function createMultipleUploadButton(elementName,elementText, textColor, appendFactor, elementAppend){
		var $inner1 = $("<span/>", {class:"fileinput-button", "data-role":"button", "data-icon":"plus"}),
		$inner2a = $("<span/>", {style:"color:"+textColor+";",text:elementText}),
		$inner2b = $("<input/>", {type:"file", id:elementName, name:elementName+"[]", "data-role":"none", multiple:""});

		if(appendFactor){
			$inner1.append($inner2a,$inner2b).appendTo(elementAppend);
		}else{
			$inner1.append($inner2a,$inner2b).prependTo(elementAppend);
		}
	}

	function createSingleUploadButton(elementName,elementText, textColor, appendFactor, elementAppend){
		var $inner1 = $("<span/>", {class:"fileinput-button", "data-role":"button", "data-icon":"plus"}),
		$inner2a = $("<span/>", {style:"color:"+textColor+";",text:elementText}),
		$inner2b = $("<input/>", {type:"file", id:elementName, name:elementName, "data-role":"none"});

		if(appendFactor){
			$inner1.append($inner2a,$inner2b).appendTo(elementAppend);
		}else{
			$inner1.append($inner2a,$inner2b).prependTo(elementAppend);
		}
	}

	function createButton(divName, elementName, elementText, textColor, appendFactor, elementAppend){
		var $inner1 = $("<div/>", { id:divName}),
		$inner2 = $("<button/>", {id:elementName, "data-inline":"true", text:elementText});

		if(appendFactor){
			$inner1.append($inner2).appendTo(elementAppend);
		}else{
			$inner1.append($inner2).prependTo(elementAppend);
		}

	}

	function createTextInput(elementId, elementText, placeHolderText, Required, textColor, appendFactor, elementAppend){
		var $inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"}),
		$inner2 = $("<div/>", {class:"ui-block-a"}),
		$inner3 = $("<fieldset/>", {"data-role":"fieldcontain"}),
		$inner4a = $("<label/>", {"for":elementId, style:"color:"+textColor+";",text:elementText}),
		$inner4a5 = $("<span/>",{style:"color:red;",text:"*"}),
		$inner4c = $("<input/>", {name:elementId, id:elementId, value:"", placeholder:placeHolderText});
		
		if(Required != "true"){
			$inner4a5 = "<!--Not Required Field-->";
		}

		if(appendFactor){
			$inner1.append($inner2.append($inner3.append($inner4a.append($inner4a5),$inner4c))).appendTo(elementAppend);
		}else{
			$inner1.append($inner2.append($inner3.append($inner4a.append($inner4a5),$inner4c))).prependTo(elementAppend);
		}

	}

	function createTextArea(elementId, elementText, textColor, appendFactor, elementAppend){
		var $inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"}),
		$inner2 = $("<div/>", {class:"ui-block-a"}),
		$inner3 = $("<fieldset/>", {"data-role":"fieldcontain"}),
		$inner4a = $("<label/>", {"for":elementId,style:"color:"+textColor+";",text:elementText}),
		$inner4b = $("<textarea/>", {name:elementId, id:elementId, value:"", type:"text"});

		if(appendFactor){
			$inner1.append($inner2.append($inner3.append($inner4a,$inner4b))).appendTo(elementAppend);
		}else{
			$inner1.append($inner2.append($inner3.append($inner4a,$inner4b))).prependTo(elementAppend);
		}

	}

	function createSelect(elementId, elementText, Required, textColor, appendFactor, elementAppend){
		var $inner1 = $("<div/>", {class:"ui-block-a"}),
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain"}),
		$inner3a = $("<label/>", {"for":elementId, class:"select"}),
		$inner3a4 = $("<p/>", {style:"color:"+textColor+";",text: elementText}),
		$inner4 = $("<span/>",{style:"color:red;",text:"*"}),
		$inner3b = $("<select/>", {name:elementId, id:elementId});

		if(Required != "true"){
			$inner4 = "<!--Not Required Field-->";
		}

		if(appendFactor){
			$inner1.append($inner2.append($inner3a.append($inner3a4.append($inner4)),$inner3b)).appendTo(elementAppend);
		}else{
			$inner1.append($inner2.append($inner3a.append($inner3a4.append($inner4)),$inner3b)).prependTo(elementAppend);
		}

	}

	function createEditDelete(editDivName, delDivName, editElementName, deleteElementName, editElementText, deleteElementText,textColor, appendFactor, elementAppend){
		var $inner1 = $("<div/>", {class:"ui-block-b"}),
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});

		createButton(editDivName,editElementName,editElementText,textColor, false,$inner2);
		createButton(delDivName,deleteElementName,deleteElementText,textColor, true,$inner2);
	
		if(appendFactor){
			$inner1.append($inner2).appendTo(elementAppend);
		}else{
			$inner1.append($inner2).prependTo(elementAppend);
		}

	}

	function createEditDeleteShow(editDivName, delDivName, showDivName, editElementName, deleteElementName, showElementName, editElementText, deleteElementText,textColor, appendFactor, elementAppend){
		var $inner1 = $("<div/>", {class:"ui-block-b"}),
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});

		createButton(editDivName,editElementName,editElementText,textColor, false,$inner2);
		createButton(delDivName,deleteElementName,deleteElementText,textColor, true,$inner2);
		createButton(showDivName,showElementName,"Show",textColor, true,$inner2);
		
		if(appendFactor){
			$inner1.append($inner2).appendTo(elementAppend);
		}else{
			$inner1.append($inner2).prependTo(elementAppend);
		}

	}

	function createMouseEventsGallery(galleryElementName){
		$('#button-right-'+galleryElementName).bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-'+galleryElementName).animate({"scrollLeft": "+=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-'+galleryElementName).stop();
			}
		});

		$('#button-left-'+galleryElementName).bind('mousedown mouseup touchstart touchend', function(event){
			if ((event.type == 'mousedown') || (event.type == 'touchstart')){
				$('#ulwrap-'+galleryElementName).animate({"scrollLeft": "-=2000px"}, 3000, 'linear');
			}else{
				$('#ulwrap-'+galleryElementName).stop();
			}
		});
	}

	function createHeaders(){
		createHeader("Game Categories", false, "#playgames");
		createHeader("Game Description", false, "#gameDescriptionPage");
		createHeader("Profile", false, "#profile");
		createHeader("Game Designer View", false, "#gameDesignerView");
		createHeader("Manage Galleries", false, "#editgalleries");
		createHeader("Manage Connections", false, "#connections");
		createHeader("Manage Games", false, "#games");
		createHeader("Create Games", false, "#creategames");
		createHeader("Edit Games", false, "#editgames");
		createHeader("Assessment System View", false, "#assessmentSystemView");
		createHeader("Manage Assessment Rules", false, "#assessmentrules");
		createHeader("Manage Experience Rules", false, "#experiencerules");
		createHeader("Manage Highscore Rules", false, "#highscorerules");
		createHeader("Manage Badge Rules", false, "#badgerules");
		createHeader("Manage Game Assessment Rules", false, "#gamesrules");

	}

	function createGameBoard(){
		createSlot("wrapperslot0", "slot0", false , "#gameSlots");
		createConnection("connection0", true, "#gameSlots");
		createSlot("wrapperslot1", "slot1", true , "#gameSlots");
		createConnection("connection1", true, "#gameSlots");
		createSlot("wrapperslot2", "slot2", true , "#gameSlots");
		createConnection("connection2", true, "#gameSlots");
		createSlot("wrapperslot3", "slot3", true , "#gameSlots");

		createGameBoardButton("wrapper-level-tutorial","button-level-tutorial","b","Show Tutorial", false, "#levelcontrol");
		var $inner1 = $("<span/>", {id:"wrapper-back-main"}),
		$inner2 = $("<a/>", {href:"#", "data-role":"button", "data-rel":"back", "data-mini":"false", text:"Back to Main Menu"});
		$inner1.append($inner2).appendTo("#levelcontrol");
		createGameBoardButton("wrapper-showme","button-showme","c","Show me", true, "#levelcontrol");
		createGameBoardButton("wrapper-tryagain","button-tryagain","c","Try Again", true, "#levelcontrol");
		createGameBoardButton("wrapper-hint","button-hint","c","Show Hint", true, "#levelcontrol");
		createGameBoardButton("wrapper-next","button-next","e","Next", true, "#levelcontrol");

		createLevelVerificationElement("level-verification-correct","Correct Answer!",true,"#levelcontrol");
		createLevelVerificationElement("level-verification-wrong","Wrong Answer",true,"#levelcontrol");
		createLevelVerificationElement("level-verification-revealed","Solution revealed",true,"#levelcontrol");

		createParagraphElement("elearning",true,"#levelcontrol");
		createParagraphElement("moreInformation",true,"#levelcontrol");
		createParagraphElement("leveldone",true,"#levelcontrol");

		createVerticalGalleryUI("gallery0", false, "#gameBoardGalleries");
		createHorizontalGalleryUI("gallery1", true, "#gameBoardGalleries");
		$("#gallery1wrapper").removeClass("horizontalgallerywrapper");
		createVerticalGalleryUI("gallery2", true, "#gameBoardGalleries");
		createHorizontalGalleryUI("gallery3", true, "#gameBoardGalleries");
		$("#gallery3wrapper").removeClass("horizontalgallerywrapper");

	}

	function createGalleriesUI(){
	
		var color = "#333399";
		createTextInput("gallery-name","Create New Gallery: ","Gallery Name, Ex: Origin","true",color,false,"#galleryInputFields");
		createTextInput("gallery-desc","Description of the gallery: ","Ex: Origin of the hormone","false",color,true,"#galleryInputFields");

		var $inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("create-gallery-button","button-create-gallery", "Create",color, true, $inner1);
		$inner1.appendTo("#galleryInputFields");

		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("reset-gallery-button","button-reset-gallery", "Reset",color, true, $inner1);
		$inner1.appendTo("#galleryInputFields");

		createSelect("select-gallery", "Select Gallery to Edit:","false",color, false, "#galleriesSelectEditDelete");
		createEditDeleteShow("edit-gallery-button","delete-button-gallery","show-gallery-button", "button-edit-gallery", "button-delete-gallery", "button-show-gallery", "Edit Gallery", "Delete Gallery",color, true, "#galleriesSelectEditDelete");

		
		createButton("undo-delete-gallery-button","button-undo-delete-gallery", "Undo Gallery Deletion",color, true, "#galleriesSelectEditDelete");
		

		createTextInput("edit-gallery-name","Gallery Name: ","","true",color,false,"#gallery-description");
		createTextInput("edit-gallery-desc","Gallery Description: ","","false",color,true,"#gallery-description");

		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("save-gallery-button","button-save-gallery", "Save",color, true, $inner1);
		$inner1.appendTo("#gallery-description");

		createHorizontalGalleryUI("manageGallery", false, "#manageGalleriesblocka");
		createMouseEventsGallery("manageGallery");

		createButton("tile-delete-button","button-delete-gallery-tile","Delete Tile",color,false,"#manageGalleriesblockb");
		createMultipleUploadButton("uploadTiles","Add Tiles",color,true,"#manageGalleriesblockb");
		createButton("undo-delete-tile-button","button-undo-delete-tile", "Undo Tile Deletion",color, true, "#manageGalleriesblockb");
		
	}


	function createConnectionsUI(){

		var color = "#9b319b";
		createButton("showconnectionsManage","show-connections-Manage","Show Existing Connections",color,false,"#connectionsBlockMain");
		createHorizontalGalleryUI("connectionsManage",true,"#connectionsblocka");
		createMouseEventsGallery("connectionsManage");
		createButton("connectionManage-delete-button","button-delete-connectionManage","Delete Connection",color,false,"#connectionsblockb");
		createButton("undo-delete-connection-button","button-undo-delete-connection", "Undo Connection Deletion",color, true, "#connectionsblockb");
		createMultipleUploadButton("uploadConnections","Add Connections",color,true,"#connectionsblockb");
	
	}

	function createGamesUI(){
		
		var color = "#990033";
		createTextInput("game-designer-name","Name:","Info shown on the game description page","false",color,false, "#gamedesignerdetails");
		createTextInput("game-designer-institution","Institution:","Info shown on the game description page","false",color,true, "#gamedesignerdetails");
		createTextInput("game-designer-email","EMail:","Info shown on the game description page","false",color,true,"#gamedesignerdetails");
		createTextInput("game-name","Game Name:","Ex. Hormones","true",color,false, "#gamedetails");
		
		$inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("gameCategory", "Select Game Category:","false",color, false, $inner1);
		$inner1.appendTo("#gamedetails");
		createTextInput("game-new-category","Create New Category:","Ex. Biology","false",color,true, "#gamedetails");
		createTextInput("game-desc","Description of the game:","Ex. Hormones and their effects on organs","false",color,true, "#gamedetails");
		createTextArea("game-desc-text","Detail Description of the game:",color,true, "#gamedetails");

		var $inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("gallerycount", "Number of Galleries:","true",color, true, $inner1);
		$inner1.appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectgallery1fieldset", class:"hideElement ui-grid-b sideByside"});
		createSelect("selectgallery1", "Select Gallery 1:","true", color, true, $inner1);

	/*	$inner2 = $("<div/>", {class:"ui-block-b"}),
		$inner3 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("view-gallery1-button","button-view-gallery1","View Gallery",color, true,$inner3);
		$inner2.append($inner3).appendTo($inner1);*/

		$inner1.appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectgallery2fieldset", class:"hideElement ui-grid-b sideByside"});
		createSelect("selectgallery2", "Select Gallery 2:","true",color, true, $inner1);

		/*$inner2 = $("<div/>", {class:"ui-block-b"}),
		$inner3 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});

		createButton("view-gallery2-button","button-view-gallery2","View Gallery",color, true,$inner3);
		$inner2.append($inner3).appendTo($inner1);*/
		$inner1.appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectgallery3fieldset", class:"hideElement ui-grid-b sideByside"});
		createSelect("selectgallery3", "Select Gallery 3:","true", color, true, $inner1);
		/*$inner2 = $("<div/>", {class:"ui-block-b"}),
		$inner3 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});

		createButton("view-gallery3-button","button-view-gallery3","View Gallery",color, true,$inner3);
		$inner2.append($inner3).appendTo($inner1);*/

		$inner1.appendTo("#gamedetails");


		$inner1 = $("<fieldset/>", {id:"selectgallery4fieldset", class:"hideElement ui-grid-b sideByside"});
		createSelect("selectgallery4", "Select Gallery 4:","true",color, true, $inner1);

		/*$inner2 = $("<div/>", {class:"ui-block-b"}),
		$inner3 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});

		createButton("view-gallery4-button","button-view-gallery4","View Gallery",color, true,$inner3);
		$inner2.append($inner3).appendTo($inner1);*/

		$inner1.appendTo("#gamedetails");

		
		$inner1 = $("<fieldset/>", {id:"selectconnection1-fieldset", class:"hideElement ui-grid-solo sideByside"});
		$inner2 = $("<div/>", {class:"ui-block-a"})
		createHorizontalGalleryUI("selectConnections1",true, $inner2);
		$inner1.append($inner2).appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectconnection2-fieldset", class:"hideElement ui-grid-solo sideByside"});
		$inner2 = $("<div/>", {class:"ui-block-a"})
		createHorizontalGalleryUI("selectConnections2",true, $inner2);
		$inner1.append($inner2).appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectconnection3-fieldset", class:"hideElement ui-grid-solo sideByside"});
		$inner2 = $("<div/>", {class:"ui-block-a"})
		createHorizontalGalleryUI("selectConnections3",true, $inner2);
		$inner1.append($inner2).appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("create-game-button","button-create-game", "Create",color, true, $inner1);
		$inner1.appendTo("#gamedetails");

		createMouseEventsGallery("selectConnections1");
		createMouseEventsGallery("selectConnections2");
		createMouseEventsGallery("selectConnections3");

	}

	function editGamesUI(){

		var color = "brown";
		createSelect("selectgame", "Select Game:", "false", color, false, "#gameSelectEditDelete");
		createEditDelete("edit-game-button","delete-button-game", "button-edit-game", "button-delete-game", "Edit Game", "Delete Game",color, true, "#gameSelectEditDelete");
		createButton("game-undo-delete-button","button-undo-delete-game", "Undo Game Deletion",color, true, "#gameSelectEditDelete");

		createTextInput("edit-game-designer-name","Name:","","false",color,false, "#editGameDesignerDetails");
		createTextInput("edit-game-designer-institution","Institution:","","false",color,true, "#editGameDesignerDetails");
		createTextInput("edit-game-designer-email","EMail:","","false",color,true,"#editGameDesignerDetails");
		
		createTextInput("edit-game-name","Game Name:","","false",color,false, "#editGameDetails");
		
		$inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("editGameCategory", "Select Game Category:","false",color, false, $inner1);
		$inner1.appendTo("#editGameDetails");
		createTextInput("edit-game-new-category","Create New Category:","","false",color,true, "#editGameDetails");
		createTextInput("edit-game-desc","Description of the game:","","false",color,true, "#editGameDetails");
		createTextArea("edit-game-desc-text","Detail Description of the game:",color,true, "#editGameDetails");

		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("save-game-button","button-save-game", "Save",color, true, $inner1);
		$inner1.appendTo("#editGameDetails");

		var $inner1 = $("<fieldset/>", {id:"gamegallery1-fieldset", class:"ui-grid-solo sideByside"}),
		$inner2 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("selectGalleryTile1", true, $inner2);
		$inner1.append($inner2).prependTo("#gameEditGalleries");

		$inner1 = $("<fieldset/>", {id:"gamegallery2-fieldset", class:"ui-grid-solo sideByside"}),
		$inner2 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("selectGalleryTile2", true, $inner2);
		$inner1.append($inner2).appendTo("#gameEditGalleries");

		$inner1 = $("<fieldset/>", {id:"gamegallery3-fieldset", class:"ui-grid-solo sideByside"}),
		$inner2 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("selectGalleryTile3", true, $inner2);
		$inner1.append($inner2).appendTo("#gameEditGalleries");

		$inner1 = $("<fieldset/>", {id:"gamegallery4-fieldset", class:"ui-grid-solo sideByside"}),
		$inner2 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("selectGalleryTile4", true, $inner2);
		$inner1.append($inner2).appendTo("#gameEditGalleries");

		createTextInput("newELearningLink","eLearning Link:","Ex. http://www.google.com","false",color, true,"#gameEditGalleries");
		createTextInput("newMoreInformationLink","More Information Link:","Ex. http://www.google.com","false",color, true,"#gameEditGalleries");

		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("create-level-button","button-create-level", "Add Level",color, true, $inner1);
		$inner1.appendTo("#gameEditGalleries");

		createMouseEventsGallery("selectGalleryTile1");
		createMouseEventsGallery("selectGalleryTile2");
		createMouseEventsGallery("selectGalleryTile3");
		createMouseEventsGallery("selectGalleryTile4");

		createSlot("editwrapperslot0","editslot0",false,"#editGameSlots");
		var $inner = $("<td/>");
		$inner.appendTo("#editGameSlots");
		createSlot("editwrapperslot1","editslot1",true,"#editGameSlots");
		$inner = $("<td/>");
		$inner.appendTo("#editGameSlots");
		createSlot("editwrapperslot2","editslot2",true,"#editGameSlots");
		$inner = $("<td/>");
		$inner.appendTo("#editGameSlots");
		createSlot("editwrapperslot3","editslot3",true,"#editGameSlots");

		createButton("previous-level-button","button-previous-level","Previous",color,true,$inner);
		createButton("next-level-button","button-next-level","Next",color,true,$inner);
		$inner.appendTo("#editGameSlots");

		createTextInput("eLearningLink","eLearning Link:", "Ex. http://www.google.com","false",color,false, "#editLevelInfo");
		createTextInput("moreInformationLink","More Information Link:","Ex. http://www.google.com","false",color, true, "#editLevelInfo");
		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("level-delete-button","button-delete-level", "Delete Level",color, true, $inner1);
		$inner1.appendTo("#editLevelInfo");
		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("level-undo-delete-button","button-undo-delete-level", "Undo Level Deletion",color, true, $inner1);
		$inner1.appendTo("#editLevelInfo");
		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("save-level-button","button-save-level", "Save",color, true, $inner1);
		$inner1.appendTo("#editLevelInfo");

		$inner1 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("setConnection1", true, $inner1);
		$inner1.prependTo("#changeconnection1-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-b"});
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("change-connection-button1","button-change-connection1", "Set Connection 1",color, true, $inner2);
		$inner1.append($inner2).appendTo("#changeconnection1-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("setConnection2", true, $inner1);
		$inner1.prependTo("#changeconnection2-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-b"});
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("change-connection-button2","button-change-connection2", "Set Connection 2", color,true, $inner2);
		$inner1.append($inner2).appendTo("#changeconnection2-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("setConnection3", true, $inner1);
		$inner1.prependTo("#changeconnection3-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-b"});
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("change-connection-button3","button-change-connection3", "Set Connection 3",color, true, $inner2);
		$inner1.append($inner2).appendTo("#changeconnection3-fieldset");

		createMouseEventsGallery("setConnection1");
		createMouseEventsGallery("setConnection2");
		createMouseEventsGallery("setConnection3");

	}

	function createExperienceRulesUI(){
		var color = "#308f44";
		createTextInput("experience-badge-name","Experience Badge Name:","Ex. Level 3","true",color,false,"#experienceBadgeBlock");
		createTextInput("experience-badge-desc","Experience Badge Description:","Ex. Advanced level","false",color,true,"#experienceBadgeBlock");
		createTextInput("experience-badge-feedback","Feedback Message:","Ex. You are a professional now!","false",color,true,"#experienceBadgeBlock");
		createTextInput("experience-badge-points","Required Points:","Ex. 400","true",color,true,"#experienceBadgeBlock");
		createSingleUploadButton("uploadExperienceBadge","Add Experience Badge",color,false,"#AddExperienceBadgeBlock");
		createButton("showexperiencebadges","show-experience-badges","Show Existing Badges",color,true,"#AddExperienceBadgeBlock");
		createHorizontalGalleryUI("experienceBadgeGallery", false, "#badgeGallery");
		createMouseEventsGallery("experienceBadgeGallery");
		createButton("edit-experience-badge-button","button-edit-experience-badge","Edit Badge",color,false,"#badgeEditDelete");
		createButton("experience-badge-delete-button","button-delete-experience-badge","Delete Badge",color,true,"#badgeEditDelete");
		createButton("show-experience-badge-button","button-show-experience-badge","Show Details",color,false,"#badgeEditDelete");
		createButton("experience-badge-undo-delete-button","button-undo-delete-experience-badge","Undo Badge Deletion",color,true,"#badgeEditDelete");


		createTextInput("edit-experience-badge-name","Experience Badge Name:","","true",color,false,"#editExperienceBadgeBlock");
		createTextInput("edit-experience-badge-desc","Experience Badge Description:","","false",color,true,"#editExperienceBadgeBlock");
		createTextInput("edit-experience-badge-feedback","Feedback Message:","","false",color,true,"#editExperienceBadgeBlock");
		createTextInput("edit-experience-badge-points","Required Points:","","true",color,true,"#editExperienceBadgeBlock");
		createButton("experience-badge-save-button","button-save-experience-badge","Save",color,true,"#editExperienceBadgeBlock");

		createTextInput("experience-highscore","Highscore: ","Ex. 1","false",color,false,"#experienceRules");
		createTextInput("experience-elearning","No. of eLearning clicks  :","Ex. 3","false",color,true,"#experienceRules");
		createTextInput("experience-moreInfo","No. of more Information clicks  :","Ex. 3","false",color,true,"#experienceRules");
		createTextInput("experience-badges","No. of Badges  :","Ex. 10","false",color,true,"#experienceRules");
		createTextInput("experience-gamesDesigned","No. of Games Designed :","Ex. 100","false",color,true,"#experienceRules");
		createTextInput("experience-login","No. of times Logged in:","Ex. 0.5","false",color,true,"#experienceRules");	
		var $inner1 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("experience-save-rules","button-save-experience-rules", "Save Rules",color, true, $inner1);
		$inner1.appendTo("#experienceRules");	

	}

	function createHighscoreRulesUI(){
		var color = "#c37719";
		createSelect("select-highscore", "Select Highscore Version to Edit: ", "false",color,false, "#editHighscoreBlock");
		createEditDeleteShow("edit-highscore-button","delete-button-highscore","show-highscore-button", "button-edit-highscore", "button-delete-highscore","button-show-highscore", "Edit Highscore Version", "Delete Highscore Version",color, true, "#editHighscoreBlock");
		createButton("highscore-undo-delete-button","button-undo-delete-highscore","Undo Version Deletion",color,true,"#editHighscoreBlock");
		createButton("highscore-reset-button","button-reset-highscore","Reset",color,true,"#editHighscoreBlock");
		createTextInput("highscore-correct","Points for correct answer :","Ex. 5","true",color,false,"#highscoreCalBlock");
		createTextInput("highscore-wrong","Points for wrong answer :","Ex. -2","true",color,true,"#highscoreCalBlock");
		createTextInput("highscore-show","Points for clicking 'Show me' button :","Ex. 0","true",color,true,"#highscoreCalBlock");
		createTextInput("highscore-tryagain","Points for clicking 'Try Again' button :","Ex. 2","true",color,true,"#highscoreCalBlock");
		createTextInput("highscore-hint","Points for clicking 'Hint' button :","Ex. 0.5","true",color,true,"#highscoreCalBlock");
		var $inner1 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("highscore-create-rules","button-create-highscore-rules", "Create New Version",color, true, $inner1);
		$inner1.appendTo("#highscoreCalBlock");	
		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("highscore-save-rules","button-save-highscore-rules", "Save",color, true, $inner1);
		$inner1.appendTo("#highscoreCalBlock");	
	}

	function createBadgeRulesUI(){
		var color = "#069090";
		createTextInput("game-badge-name","Badge Name:","Ex. Correctamundo","true",color,false,"#BadgeDetailsBlock");
		createTextInput("game-badge-desc","Badge Description:","Ex. Ten correct answers","false",color,true,"#BadgeDetailsBlock");
		createTextInput("game-badge-feedback","Feedback Message:","Ex. You have answered 10 levels correctly!","false",color,true,"#BadgeDetailsBlock");
		createSingleUploadButton("uploadGameBadge","Add Badge",color,false,"#uploadBadgeBlock");
		createButton("showgamebadges","show-game-badges","Show Existing Badges",color,true,"#uploadBadgeBlock");
		createHorizontalGalleryUI("gameBadgeGallery", false, "#gameBadgeGalBlock");
		createMouseEventsGallery("gameBadgeGallery");
		createButton("edit-game-badge-button","button-edit-game-badge","Edit Badge",color,false,"#editDeleteGameBadgeBlock");
		createButton("game-badge-delete-button","button-delete-game-badge","Delete Badge",color,true,"#editDeleteGameBadgeBlock");
		createButton("game-badge-undo-delete-button","button-undo-delete-game-badge","Undo Badge Deletion",color,true,"#editDeleteGameBadgeBlock");
		createTextInput("edit-game-badge-name","Badge Name:","Ex. Correctamundo","true",color,false,"#EditBadgeDetailsBlock");
		createTextInput("edit-game-badge-desc","Badge Description:","Ex. Ten correct answers","false",color,true,"#EditBadgeDetailsBlock");
		createTextInput("edit-game-badge-feedback","Feedback Message:","Ex. You have answered 10 levels correctly!","false",color,true,"#EditBadgeDetailsBlock");
		createButton("game-badge-save-button","button-save-game-badge","Save",color,true,"#gameBadgeSaveButtonDiv");
	}

	function createGameRulesUI(){
		var color = "#5f0e88";
		var $inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("select-game-assessment","Select Game:","false",color,false,$inner1);

		var $inner2 = $("<div/>",{class:"ui-block-b"}),
		$inner3 = $("<fieldset/>",{"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("edit-game-rules-button","button-edit-game-rules","Edit",color,true,$inner3);
		$inner2.append($inner3).appendTo($inner1);
		
		$inner1.prependTo("#SelectGameRulesBlock");

		$inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("select-highscore-assessment","Select Highscore Version:","false",color,false,$inner1);

		$inner1.appendTo("#EditGameRulesBlock");

		createHorizontalGalleryUI("gameCompletionBadgeGallery", false, "#gameBadgeSelectBlock");
		createMouseEventsGallery("gameCompletionBadgeGallery");

		createButton("game-save-rules","button-save-game-rules","Save",color,true,"#saveGameRules");

	}

	createHeaders();
	createGameBoard();
	createGalleriesUI();
	createConnectionsUI();
	createGamesUI();
	editGamesUI();
	createExperienceRulesUI();
	createHighscoreRulesUI();
	createBadgeRulesUI();
	createGameRulesUI();

});