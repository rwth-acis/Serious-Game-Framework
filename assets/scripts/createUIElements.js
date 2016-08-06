$(document).ready(function() {

	function createHeader(headerName, appendFactor, elementAppend){
		
		var $inner1 = $("<div/>", {"data-role":"header", "data-theme":"b"}),
		$inner2a = $("<a/>", {href:"#", "data-icon":"arrow-l", class:"ui-btn-left", "data-iconpos":"notext", "data-rel":"back", text:"Home"}),
		$inner2b = $("<h2/>", {text:headerName});

		if(appendFactor){
			$inner1.append($inner2a,$inner2b).appendTo(elementAppend);
		}else{
			$inner1.append($inner2a,$inner2b).prependTo(elementAppend);
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

	function createMultipleUploadButton(elementName,elementText, appendFactor, elementAppend){
		var $inner1 = $("<span/>", {class:"fileinput-button", "data-role":"button", "data-icon":"plus"}),
		$inner2a = $("<span/>", {text:elementText}),
		$inner2b = $("<input/>", {type:"file", id:elementName, name:elementName+"[]", "data-role":"none", multiple:""});

		if(appendFactor){
			$inner1.append($inner2a,$inner2b).appendTo(elementAppend);
		}else{
			$inner1.append($inner2a,$inner2b).prependTo(elementAppend);
		}
	}

	function createSingleUploadButton(elementName,elementText, appendFactor, elementAppend){
		var $inner1 = $("<span/>", {class:"fileinput-button", "data-role":"button", "data-icon":"plus"}),
		$inner2a = $("<span/>", {text:elementText}),
		$inner2b = $("<input/>", {type:"file", id:elementName, name:elementName, "data-role":"none"});

		if(appendFactor){
			$inner1.append($inner2a,$inner2b).appendTo(elementAppend);
		}else{
			$inner1.append($inner2a,$inner2b).prependTo(elementAppend);
		}
	}

	function createButton(divName, elementName, elementText, appendFactor, elementAppend){
		var $inner1 = $("<div/>", { id:divName}),
		$inner2 = $("<button/>", {id:elementName, "data-inline":"true", text:elementText});

		if(appendFactor){
			$inner1.append($inner2).appendTo(elementAppend);
		}else{
			$inner1.append($inner2).prependTo(elementAppend);
		}
	}

	function createTextInput(elementId, elementText, placeHolderText, Required, appendFactor, elementAppend){
		var $inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"}),
		$inner2 = $("<div/>", {class:"ui-block-a"}),
		$inner3 = $("<fieldset/>", {"data-role":"fieldcontain"}),
		$inner4a = $("<label/>", {"for":elementId,text:elementText}),
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

	function createTextArea(elementId, elementText, appendFactor, elementAppend){
		var $inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"}),
		$inner2 = $("<div/>", {class:"ui-block-a"}),
		$inner3 = $("<fieldset/>", {"data-role":"fieldcontain"}),
		$inner4a = $("<label/>", {"for":elementId,text:elementText}),
		$inner4b = $("<textarea/>", {name:elementId, id:elementId, value:"", type:"text"});

		if(appendFactor){
			$inner1.append($inner2.append($inner3.append($inner4a,$inner4b))).appendTo(elementAppend);
		}else{
			$inner1.append($inner2.append($inner3.append($inner4a,$inner4b))).prependTo(elementAppend);
		}

	}

	function createSelect(elementId, elementText, Required, appendFactor, elementAppend){
		var $inner1 = $("<div/>", {class:"ui-block-a"}),
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain"}),
		$inner3a = $("<label/>", {"for":elementId, class:"select"}),
		$inner3a4 = $("<p/>", {text: elementText}),
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

	function createEditDelete(editDivName, delDivName, editElementName, deleteElementName, editElementText, deleteElementText, appendFactor, elementAppend){
		var $inner1 = $("<div/>", {class:"ui-block-b"}),
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});

		createButton(editDivName,editElementName,editElementText,false,$inner2);
		createButton(delDivName,deleteElementName,deleteElementText,true,$inner2);

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
		createHeader("Play Games", false, "#playgames");
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
	

		createTextInput("gallery-name","Create New Gallery: ","Gallery Name, Ex: Origin","true",false,"#galleryInputFields");
		createTextInput("gallery-desc","Description of the gallery: ","Ex: Origin of the hormone","false",true,"#galleryInputFields");

		var $inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("create-gallery-button","button-create-gallery", "Create", true, $inner1);
		$inner1.appendTo("#galleryInputFields");

		createSelect("select-gallery", "Select Gallery to Edit:","false", false, "#galleriesSelectEditDelete");
		createEditDelete("edit-gallery-button","delete-button-gallery", "button-edit-gallery", "button-delete-gallery", "Edit Gallery", "Delete Gallery", true, "#galleriesSelectEditDelete");

		createHorizontalGalleryUI("manageGallery", false, "#manageGalleriesblocka");
		createMouseEventsGallery("manageGallery");

		createButton("tile-delete-button","button-delete-gallery-tile","Delete Tile",false,"#manageGalleriesblockb");
		createMultipleUploadButton("uploadTiles","Add Tiles",true,"#manageGalleriesblockb");

	}


	function createConnectionsUI(){
		
		createButton("showconnectionsManage","show-connections-Manage","Show Existing Connections",false,"#connectionsBlockMain");
		createHorizontalGalleryUI("connectionsManage",true,"#connectionsblocka");
		createButton("connectionManage-delete-button","button-delete-connectionManage","Delete Connection",false,"#connectionsblockb");
		createMultipleUploadButton("uploadConnections","Add Connections",true,"#connectionsblockb");
	
	}

	function createGamesUI(){
		
		createTextInput("game-designer-name","Name:","Info shown on the game description page","false",false, "#gamedesignerdetails");
		createTextInput("game-designer-institution","Institution:","Info shown on the game description page","false",true, "#gamedesignerdetails");
		createTextInput("game-designer-email","EMail:","Info shown on the game description page","false",true,"#gamedesignerdetails");
		createTextInput("game-name","Game Name:","Ex. Hormones","true",false, "#gamedetails");
		$inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("gameCategory", "Select Game Category:","true", false, $inner1);
		$inner1.appendTo("#gamedetails");
		createTextInput("game-new-category","Create New Category:","Ex. Biology","false",true, "#gamedetails");
		createTextInput("game-desc","Description of the game:","Ex. Hormones and their effects on organs","false",true, "#gamedetails");
		createTextArea("game-desc-text","Detail Description of the game:",true, "#gamedetails");

		var $inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("gallerycount", "Number of Galleries:","true", true, $inner1);
		$inner1.appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectgallery1fieldset", class:"hideElement ui-grid-b sideByside"});
		createSelect("selectgallery1", "Select Gallery 1:","true", true, $inner1);
		$inner1.appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectgallery2fieldset", class:"hideElement ui-grid-b sideByside"});
		createSelect("selectgallery2", "Select Gallery 2:","true", true, $inner1);
		$inner1.appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectgallery3fieldset", class:"hideElement ui-grid-b sideByside"});
		createSelect("selectgallery3", "Select Gallery 3:","true", true, $inner1);
		$inner1.appendTo("#gamedetails");

		$inner1 = $("<fieldset/>", {id:"selectgallery4fieldset", class:"hideElement ui-grid-b sideByside"});
		createSelect("selectgallery4", "Select Gallery 4:","true", true, $inner1);
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
		createButton("create-game-button","button-create-game", "Create", true, $inner1);
		$inner1.appendTo("#gamedetails");

		createMouseEventsGallery("selectConnections1");
		createMouseEventsGallery("selectConnections2");
		createMouseEventsGallery("selectConnections3");

	}

	function editGamesUI(){
		createSelect("selectgame", "Select Game:", false, "#gameSelectEditDelete");
		createEditDelete("edit-game-button","delete-button-game", "button-edit-game", "button-delete-game", "Edit Game", "Delete Game", true, "#gameSelectEditDelete");

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

		createTextInput("newELearningLink","eLearning Link:","Ex. http://www.google.com","false",true,"#gameEditGalleries");
		createTextInput("newMoreInformationLink","More Information Link:","Ex. http://www.google.com","false",true,"#gameEditGalleries");

		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("create-level-button","button-create-level", "Add Level", true, $inner1);
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

		createButton("previous-level-button","button-previous-level","Previous",true,$inner);
		createButton("next-level-button","button-next-level","Next",true,$inner);
		$inner.appendTo("#editGameSlots");

		createTextInput("eLearningLink","eLearning Link:", "Ex. http://www.google.com","false",false, "#editLevelInfo");
		createTextInput("moreInformationLink","More Information Link:","Ex. http://www.google.com","false", true, "#editLevelInfo");
		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("level-delete-button","button-delete-level", "Delete Level", true, $inner1);
		$inner1.appendTo("#editLevelInfo");
		$inner1 = $("<fieldset/>", {"data-role":"fieldcontain"});
		createButton("save-level-button","button-save-level", "Save", true, $inner1);
		$inner1.appendTo("#editLevelInfo");

		$inner1 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("setConnection1", true, $inner1);
		$inner1.prependTo("#changeconnection1-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-b"});
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("change-connection-button1","button-change-connection1", "Set Connection 1", true, $inner2);
		$inner1.append($inner2).appendTo("#changeconnection1-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("setConnection2", true, $inner1);
		$inner1.prependTo("#changeconnection2-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-b"});
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("change-connection-button2","button-change-connection2", "Set Connection 2", true, $inner2);
		$inner1.append($inner2).appendTo("#changeconnection2-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-a"});
		createHorizontalGalleryUI("setConnection3", true, $inner1);
		$inner1.prependTo("#changeconnection3-fieldset");

		$inner1 = $("<div/>", {class:"ui-block-b"});
		$inner2 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("change-connection-button3","button-change-connection3", "Set Connection 3", true, $inner2);
		$inner1.append($inner2).appendTo("#changeconnection3-fieldset");

		createMouseEventsGallery("setConnection1");
		createMouseEventsGallery("setConnection2");
		createMouseEventsGallery("setConnection3");

	}

	function createExperienceRulesUI(){

		createTextInput("experience-badge-name","Experience Badge Name:","Ex. Level 3","true",false,"#experienceBadgeBlock");
		createTextInput("experience-badge-desc","Experience Badge Description:","Ex. Advanced level","false",true,"#experienceBadgeBlock");
		createTextInput("experience-badge-feedback","Feedback Message:","Ex. You are a professional now!","false",true,"#experienceBadgeBlock");
		createTextInput("experience-badge-points","Required Points:","Ex. 400","true",true,"#experienceBadgeBlock");
		createSingleUploadButton("uploadExperienceBadge","Add Experience Badge",false,"#AddExperienceBadgeBlock");
		createButton("showexperiencebadges","show-experience-badges","Show Existing Badges",true,"#AddExperienceBadgeBlock");
		createHorizontalGalleryUI("experienceBadgeGallery", false, "#badgeGallery");
		createMouseEventsGallery("experienceBadgeGallery");
		createButton("edit-experience-badge-button","button-edit-experience-badge","Edit Badge",false,"#badgeEditDelete");
		createButton("experience-badge-delete-button","button-delete-experience-badge","Delete Badge",true,"#badgeEditDelete");

		createTextInput("experience-highscore","Highscore * :","Ex. 1","false",false,"#experienceRules");
		createTextInput("experience-elearning","No. of eLearning clicks * :","Ex. 3","false",true,"#experienceRules");
		createTextInput("experience-badges","No. of Badges * :","Ex. 10","false",true,"#experienceRules");
		createTextInput("experience-gamesDesigned","No. of Games Designed *:","Ex. 100","false",true,"#experienceRules");
		createTextInput("experience-login","No. of times Logged in:","Ex. 0.5","false",true,"#experienceRules");	
		var $inner1 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("experience-save-rules","button-save-experience-rules", "Save Rules", true, $inner1);
		$inner1.appendTo("#experienceRules");	

	}

	function createHighscoreRulesUI(){
		createSelect("select-highscore", "Select Highscore Version to Edit: ", false, "#editHighscoreBlock");
		createEditDelete("edit-highscore-button","delete-button-highscore", "button-edit-highscore", "button-delete-highscore", "Edit Highscore Version", "Delete Highscore Version", true, "#editHighscoreBlock");
		createTextInput("highscore-version","Highscore Version :","Ex. 1.3","false",false,"#highscoreCalBlock");
		createTextInput("highscore-correct","Points for correct answer :","Ex. 5","true",true,"#highscoreCalBlock");
		createTextInput("highscore-wrong","Points for wrong answer :","Ex. -2","true",true,"#highscoreCalBlock");
		createTextInput("highscore-show","Points for clicking 'Show me' button :","Ex. 0","true",true,"#highscoreCalBlock");
		createTextInput("highscore-tryagain","Points for clicking 'Try Again' button :","Ex. 2","true",true,"#highscoreCalBlock");
		createTextInput("highscore-hint","Points for clicking 'Hint' button :","Ex. 0.5","true",true,"#highscoreCalBlock");
		var $inner1 = $("<fieldset/>", {"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("highscore-create-rules","button-create-highscore-rules", "Create New Version", true, $inner1);
		$inner1.appendTo("#highscoreCalBlock");	
	}

	function createBadgeRulesUI(){
		createTextInput("game-badge-name","Badge Name:","Ex. Correctamundo","true",false,"#BadgeDetailsBlock");
		createTextInput("game-badge-desc","Badge Description:","Ex. Ten correct answers","false",true,"#BadgeDetailsBlock");
		createTextInput("game-badge-feedback","Feedback Message:","Ex. You have answered 10 levels correctly!","false",true,"#BadgeDetailsBlock");
		createSingleUploadButton("uploadGameBadge","Add Badge",false,"#uploadBadgeBlock");
		createButton("showgamebadges","show-game-badges","Show Existing Badges",true,"#uploadBadgeBlock");
		createHorizontalGalleryUI("gameBadgeGallery", false, "#gameBadgeGalBlock");
		createMouseEventsGallery("gameBadgeGallery");
		createButton("edit-game-badge-button","button-edit-game-badge","Edit Badge",false,"#editDeleteGameBadgeBlock");
		createButton("game-badge-delete-button","button-delete-game-badge","Delete Badge",true,"#editDeleteGameBadgeBlock");
	}

	function createGameRulesUI(){
		var $inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("select-game-assessment","Select Game:",false,$inner1);

		var $inner2 = $("<div/>",{class:"ui-block-b"}),
		$inner3 = $("<fieldset/>",{"data-role":"fieldcontain", class:"ui-block-b"});
		createButton("edit-game-rules-button","button-edit-game-rules","Edit",true,$inner3);
		$inner2.append($inner3).appendTo($inner1);
		
		$inner1.prependTo("#SelectGameRulesBlock");

		$inner1 = $("<fieldset/>", {class:"ui-grid-b sideByside"});
		createSelect("select-highscore-assessment","Select Highscore Version:",false,$inner1);

		$inner1.appendTo("#SelectGameRulesBlock");

		createHorizontalGalleryUI("gameCompletionBadgeGallery", false, "#gameBadgeSelectBlock");
		createMouseEventsGallery("gameCompletionBadgeGallery");

		createButton("game-save-rules","button-save-game-rules","Save",true,"#saveGameRules");

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