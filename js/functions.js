draggedElem = null;

function vAlign(elements) {
	$(elements).each(function(i, e) {
		//Gambiarra para nao dar erro com a altura
		//html e body com height = 100% nao funciona bem
		if (e.parentNode.tagName == "BODY") {
			var parentH = $(window).height();
		} else {
			var parentH = $(e).parent().height();
		}

		var thisH = $(e).outerHeight(true);
		var margin = (parentH - thisH)/2;
		if (margin < 0) {
			margin = 0;
		}

		$(e).css("margin-top", margin);
	});
}

function createElementContainer(container, callback) {
	var tabs = $("<ul class='containerMenu fullWidth'></ul>");
	var content = $("<ul class='containerContent fullWidth'></ul>");
	
	for (a in Object.keys(globalElements)) {
		var name = Object.keys(globalElements)[a];

		var thisTab = "<li onclick='changeTab(this)'>"
		    thisTab += name + "</li>";
		tabs.append($(thisTab));

		var thisContent = "<li id='content_" + name + "' class='category'></li>";
		content.append($(thisContent));	
	}

	$(tabs).children().addClass("rCTop uC smallText border");
	$(content).addClass("bShadowLight rCBottom border");

	$(container).append(tabs, content);

	if (callback) {
		callback();
	}
}

function createElements(objectElem) {
	var ulElements = $("<ul class='catElements fLeft'></ul>");
	var category = $(objectElem).attr("id").substr(8);
	if ($(globalElements[category]).length >= 12) {
		var controller = "<div class='controller fullWidth'>";
		controller += "<span class='previous'><</span>";
		for (var i = 0; i < $(globalElements[category]).length/12; i++) {
			controller += "<span class='page'>" + (i+1) + "</span>";
		}
		controller += "<span class='next'>></span>";
		$(objectElem).append($(controller));
	}
	$(globalElements[category]).each(function(i, e) {
		var thisElem = $("<li class='bShadowLight rCSmall border fLeft' ondrag='dragIt(this)' onclick='selectProd(this)' draggable=true></li>");

		var thisImg = $("<img id='" + e.id + "' class='draggable " + category + "' ondrag='dragIt(this)' onclick='selectProd(this)' src='images/" + e.id + ".png'>");
		thisImg.attr("title", e.title);
		thisImg.attr("type", e.type);

		ulElements.append(thisElem);
		thisElem.append(thisImg);

		if (category === "roupas" || category == "efeitos") {
			thisImg.css("top", e.position.top)
			.css("left", e.position.left)
			.css("z-index", e.layer);
		}
	});
	$(objectElem).append(ulElements);
	$(ulElements).children("li:nth-child(3n)").css("margin-right", 0);
}

function changeTab(tab) {
	$(".containerMenu li.active").removeClass("active");
	$(".containerContent li.active").removeClass("active");
	$(tab).addClass("active");
	$(".containerContent>li").eq($(tab).index()).addClass("active");
}

function dragIt(elem) {
	draggedElem = $(elem);
}

function dropIt(area) {
	if ($(area).attr("id") === "canvas") {
		if (!$(draggedElem).hasClass("disabled")) {
			dressIt($(draggedElem).children());
			selectIt($(draggedElem));
		}
	} else if ($(area).attr("id") === "elements") {
		undressIt($(draggedElem));
	}
}

function selectIt(elem) {
	$(elem).addClass("disabled");
	$(elem).children().attr("elemId", $(elem).children().attr("id"))
		              .removeAttr("id");
}

function unselectIt(elem) {
	$(elem).parent().removeClass("disabled");
	$(elem).attr("id", $(elem).attr("elemId"))
		   .removeAttr("elemId");
}

function dressIt(elem) {
	var dressed = $(elem).clone();
	var type = $(dressed).attr("type");
	var sameItem = $("#canvas").find("[type='" + type + "']");
	$(dressed).addClass("dressed");
	if (sameItem.length > 0) {
		undressIt(sameItem);
	}
	$("#canvas").append($(dressed));
}

function undressIt(elem) {
	unselectIt($("[elemId='" + $(elem).attr("id") + "']"));
	$(elem).remove();
}

function selectProd(elem) {
	if ($(elem).parent().attr("id") === "canvas") {
		undressIt($(elem));
	} else {
		if ($(elem).hasClass("disabled")) {
			var dressed = $("#" + $(elem).children().attr("elemid"));
			undressIt(dressed);
		} else {
			dressIt($(elem).children());
			selectIt($(elem));
		}
	}
}

function initialize() {
	$("[type='modelo']").eq(0).parent().click();
	$("[type='background']").eq(0).parent().click();
	$("[type='panties']").eq(0).parent().click();
	$("[type='soutien']").eq(0).parent().click();
	$("[type='shadow']").eq(0).parent().click();
}