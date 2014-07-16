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

	$(globalElements[category]).each(function(i, e) {
		var thisElem = $("<li class='bShadowLight rCSmall border fLeft' ondrag='dragIt(event, this)' onclick='selectProd(this)' draggable=true></li>");

		var thisImg = $("<img id='" + e.id + "' class='draggable " + category + "' ondrag='dragIt(event, this)' onclick='selectProd(this)' src='images/" + e.id + ".png'>");
		    thisImg.attr("title", e.title);
		    thisImg.attr("type", e.type);

		if (category === "roupas") {
			var thisLabel = $("<div class='label fullWidth'></div>");
		    thisLabel.append("<h3>" + e.title + "</h3>");
			if (e.marca !== "" && e.marca !== undefined && e.marca !== null) {
				thisLabel.append("<h4>" + e.marca + "</h4>");
			} else {
				thisLabel.append("<h4>Marca não definida</h4>");
			}
			thisLabel.attr('unselectable', 'on')
                     .css('user-select', 'none')
                     .on('selectstart', false);
		}

		ulElements.append(thisElem);
		thisElem.append(thisImg, thisLabel);

		if (e.position !== "" && e.position !== undefined && e.position !== null) {
			thisImg.css("top", e.position.top)
			       .css("left", e.position.left);
		}
		if (e.layer !== "" && e.layer !== undefined && e.layer !== null) {
			thisImg.css("z-index", e.layer);
		}
	});
	$(objectElem).append(ulElements);
	$(ulElements).children("li:nth-child(3n)").css("margin-right", 0);

	if ($(globalElements[category]).length >= 12) {
		scrollPages(objectElem, $(globalElements[category]));
	}

	setLabels($("#content_roupas .catElements li"));
	centerImg($(".catElements li"));
}

function setLabels(elemList) {
	$(elemList).each(function(i, e) {
		var label = $(e).find(".label");
		label.css({
			left: 0,
			opacity: 0,
			display: "none"
		});
		label.parent().hover(function() {
			$(this).children('.label').stop(true, true);
			$(this).children('.label').css({
				display: "block",
				bottom: "-50%"
			});
			$(this).children('.label').animate({
				bottom: 0,
				opacity: 100
			});
		}, function() {
		    $(this).children('.label').animate({
				bottom: "50%",
				opacity: 0
			}, {
				complete: function() {
					$(this).children('.label').css("display", "none");
				}
			});
		});
	});
}

function centerImg(elemList) {
	$(elemList).each(function(i, e) {
		var img = $(e).find("img");
		var auxImg = $("<img/>");
		auxImg.attr("src", img.attr("src"));
		auxImg.load(function() {
			if (this.width < $(e).width() && this.height < $(e).height()) {
				img.addClass("noResize");
			} else if (this.width > this.height) {
				img.addClass("horizontal");
			} else {
				img.addClass("vertical")
			}
			vAlign(img);
		});
	});
}

function fixColors(elemList) {
	colors = ["#e9e9e9", "#ddd", "#d5d5d5", "#c8c8c8"];
	$(elemList).children().each(function(i, e) {
		$(e).css("background-color", colors[i]);
	});
}

function changeTab(tab) {
	$(".containerMenu li.active").removeClass("active");
	$(".containerContent li.active").removeClass("active");
	$(tab).addClass("active");
	$(".containerContent>li").eq($(tab).index()).addClass("active");
}

function scrollPages(parent, list) {
	var controller = "<div class='controller fullWidth'>";
	controller += "<span onclick='scrollThis(this)' class='previous'><</span>";
	for (var i = 0; i < $(list).length/12; i++) {
		controller += "<span onclick='scrollThis(this)' class='page'>" + (i+1) + "</span>";
	}
	controller += "<span onclick='scrollThis(this)' class='next'>></span>";
	$(parent).append($(controller));
	$(".controller .page").eq(0).click();
}

function scrollThis(elem) {
	var catElements = $(elem).parents(".category").find(".catElements");
	if ($(elem).hasClass("page")) {
		var page = parseInt($(elem).html()) - 1;
		catElements.animate({
			"top": page * (-412) + 10
		});
		$(elem).siblings(".active").removeClass("active");
		$(elem).addClass("active");
	} else if ($(elem).hasClass("next") && $(elem).siblings(".page.active").next(".page").length > 0) {
		$(elem).siblings(".page.active").next(".page").click();
	} else if ($(elem).hasClass("previous") && $(elem).siblings(".page.active").prev(".page").length > 0) {
		$(elem).siblings(".page.active").prev(".page").click();
	}
}

function dragIt(event, elem) {
	draggedElem = $(elem);
}

function dropIt(event, area) {
	event.preventDefault();
	if ($(area).attr("id") === "canvas") {
		if (!$(draggedElem).hasClass("disabled")) {
			dressIt($(draggedElem).children());
			selectIt($(draggedElem));
		}
	} else if ($(area).attr("id") === "elements" && !$(draggedElem).parent().hasClass("catElements")) {
		undressIt($(draggedElem));
	}
}

function selectIt(elem) {
	$(elem).addClass("disabled");
	$(elem).children("img").attr("elemId", $(elem).children().attr("id"))
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
	//Gambiarra para concertar um erro esquisito
	$("#canvas").find(".label").remove();
	console.log("dressIt");
	setDressedPieces($("#canvas"));
}

function setDressedPieces(parent) {
	var dressed = [];
	$(parent).find(".dressed").each(function(i, e) {
		var prodId = $(e).attr("id");
		for (var i = 0; i < Object.keys(globalElements).length; i++) {
			var category = Object.keys(globalElements)[i];
			$.grep(globalElements[category], function(j){
				if (j.id === prodId) {
					dressed.push(j);
				}
			});
		}
	});
	console.log(dressed);
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