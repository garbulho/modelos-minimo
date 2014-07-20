//globalElements;
draggedElem = null;

function createObject() {
	/*$.getJSON("COLOCAR AQUI O ENDEREÇO", function(data) {
	    console.log(data);
	    //globalElements = data;
	    //globalElements = JSON.parse(data);
	});*/
}

function getContent(type) {
	/*var url;
	if (type === "dressed") {
		url = "";
	} else if (type === "fav") {
		url = "";
	} else if (type === "recomended") {
		url = "";
	} else if (type === "recent") {
		url = "";
	}
	$.getJSON(url, function(data) {
		jsContent = JSON.parse(data);
		return jsContent;
	});*/
	var objects;
	if (type === "dressed" || type == "fav") {
		objects = globalElements;
	} else if (type === "recomended") {
		objects = recomended;
	} else if (type === "recent") {
		objects = recent;
	}
	return objects;
}

function postContent(contentObj, type) {
	/*var url;
	if (type === "recomended") {
		url = "";
	} else if (type === "recent") {
		url = "";
	} else {
		url = "";
	};
	$.ajax({
	    type: "POST",
	    url: url,
	    data: JSON.stringify(contentObj),
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: function(data){
	    	console.log("postContent: ");
	    	console.log(contentObj);
	    },
	    failure: function(errMsg) {
	        console.error("postContent");
	    }
	});*/
//console.log(recent);
//console.log(contentObj);
	if (type === "recomended") {
		console.log("recomended");
		recomended = contentObj;
	} else if (type === "recent") {
		console.log("recent");
		recent = contentObj;
	} else {
		console.log("outros");
		globalElements = contentObj;
	}
}

function createElementContainer(container, callback) {
	var tabs = $("<ul class='containerMenu fullWidth'></ul>");
	var content = $("<div class='containerContent fullWidth'></ul>");
	
	for (a in Object.keys(globalElements)) {
		var name = Object.keys(globalElements)[a];

		var thisTab = "<li onclick='changeTab(this)' id='" + name + "'>"
		    thisTab += name + "</li>";
		tabs.append($(thisTab));
	}

	$(tabs).children().addClass("rCTop uC smallText border");
	$(content).addClass("bShadowLight rCBottom border");

	$(container).append(tabs, content);

	if (callback) {
		callback();
	}
}

function createBtnsCat(parent, list) {
	if ($(parent).children($(".catElements")).length > 0) {
		$(parent).children($(".catElements")).remove();
	}
	var ulElements = $("<ul class='catElements fLeft'></ul>");
	
	for (var i = 0; i < Object.keys(globalElements).length; i++) {
		var category = Object.keys(globalElements)[i];
		createCards(ulElements, globalElements[category]);
	}

	$(parent).append(ulElements);
}

function createCards(ulElements, list) {
	for(var i = 0; i < list.length; i++) {

		var thisElem = $("<li class='bShadowLight rCSmall border fLeft' ondrag='dragIt(event, this)' onclick='selectProd(this)' draggable=true></li>")
		            .addClass(list[i].category);
		var thisImg = $("<img class='draggable " + list[i].category + "' ondrag='dragIt(event, this)' src='images/" + list[i].id + ".png'>")
		           .attr("title", list[i].title)
		           .attr("type", list[i].type)
		           .attr("id", list[i].id);

		var thisFav = $("<label class='fav' onclick='favThis(this)'></label>");

		if (list[i].isDressed) {
			thisElem.addClass("toSelect");
		} 
		if (list[i].fav === true) {
			thisElem.addClass("favorite");
			thisFav.addClass("selected");
		}

		if (thisImg.hasClass("roupas")) {
			var thisLabel = $("<div class='label fullWidth'></div>");
		    thisLabel.append("<h3>" + list[i].title + "</h3>");
			if (list[i].marca !== "" && list[i].marca !== undefined && list[i].marca !== null) {
				thisLabel.append("<h4>" + list[i].marca + "</h4>");
			} else {
				thisLabel.append("<h4>Marca não definida</h4>");
			}
			thisLabel.attr('unselectable', 'on')
                     .css('user-select', 'none')
                     .on('selectstart', false);
		}

		//seta posição
		if (list[i].position !== "" && list[i].position !== undefined && list[i].position !== null) {
			thisImg.css("top", list[i].position.top)
			       .css("left", list[i].position.left);
		}
		if (list[i].layer !== "" && list[i].layer !== undefined && list[i].layer !== null) {
			thisImg.css("z-index", list[i].layer);
		}

		//appends
		ulElements.append(thisElem);
		$(thisLabel).append(thisFav);
		thisElem.append(thisImg, thisLabel);
	
	centerImg($(".catElements li"));
	}
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
			$(this).children('.label').stop(true, false);
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
				img.addClass("noResize vAlign");
				img.css("margin-top", ($(e).height() - this.height)/2);
			} else if (this.width < this.height) {
				img.addClass("vertical");
			} else {
				img.addClass("horizontal vAlign");
				if(($(e).height() - this.height)/2 > 0) {
					img.css("margin-top", ($(e).height() - this.height)/2);	
				} else {
					img.css("margin-top", 0);
				}
			}
		});
	});
}

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

function fixColors(elemList) {
	colors = ["#e9e9e9", "#ddd", "#d5d5d5", "#c8c8c8"];
	$(elemList).children().each(function(i, e) {
		$(e).css("background-color", colors[i]);
	});
}

function changeTab(tab) {
	$(".menu li.selected").removeClass("selected");
	$(".containerMenu li.active").removeClass("active");
	$(tab).addClass("active");

	console.log(tab);

	filterContent($(tab).attr("id"));
}

function filterContent(filter) {
	var results = $(".containerContent").find("li." + filter);
	var rest = $(".containerContent").find("li").not("." + filter);
	results.show();
	rest.hide();

	if (results.length > 12) {
		scrollPages($(".containerContent"), results);
	} else {
		$(".controller").remove();
		$(".catElements").css("top", 10);
	}

	$(results).children("li:nth-child(3n)").css("margin-right", 0);
}

function createPagesContent() {
	var list = $("<ul class='category pages fullWidth bShadowLight rCBottom border'></ul>");
	$(".menu li").each(function(i, e) {
		var listItem = $("<li id='" + $(e).attr("auxid") + "'></li>");
		var catElements = $("<ul class='catElements fLeft'></ul>");
		listItem.append(catElements);
		list.append(listItem);
	});
	$("#elements").append(list);
}

function scrollPages(parent, list) {
	var controller = "<div class='controller fullWidth'>";
	controller += "<span onclick='scrollThis(this)' class='previous'><</span>";
	for (var i = 0; i < $(list).length/12; i++) {
		controller += "<span onclick='scrollThis(this)' class='page'>" + (i+1) + "</span>";
	}
	controller += "<span onclick='scrollThis(this)' class='next'>></span>";
	$(parent).append($(controller));
	console.log($(".controller .page").eq(0));
	$(".controller .page").eq(0).click();
}

function scrollThis(elem) {
	var catElements = $(elem).parents(".containerContent").find(".catElements");
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
	$(draggedElem).click();
}

function selectIt(elem) {
	$(elem).addClass("disabled");
	$("[copyid='" + $(elem).children().attr("id") + "']").parent().addClass("disabled");
	$(elem).children("img").attr("elemId", $(elem).children().attr("id"))
		              .removeAttr("id");
}

function unselectIt(elem) {
	$(elem).parent().removeClass("disabled");
	$(elem).attr("id", $(elem).attr("elemId"))
		   .removeAttr("elemId");
}

function getObjByAttr(attr, value) {
	var theObjects = [];
	for (var i = 0; i < Object.keys(globalElements).length; i++) {
		var category = Object.keys(globalElements)[i];
		$.grep(globalElements[category], function(j){
			if (j[attr] === value) {
				theObjects.push(j);
			}
		});
	}
	return theObjects;
}

function dressIt(elem) {
	var dressed = $(elem).clone();
	var type = $(dressed).attr("type");
	var sameItem = $("#canvas").find("[type='" + type + "']");

	$(dressed).addClass("dressed").attr("onclick", "selectProd(this)");

	if (sameItem.length > 0) {
		undressIt(sameItem);
	}

	$("#canvas").append($(dressed));
	//Gambiarra para concertar um erro esquisito
	$("#canvas").find(".label").remove();

	selectIt($(elem).parent());

	getObjByAttr("id", $(dressed).attr("id"))[0].isDressed = true;
	postContent(globalElements);
}

function undressIt(elem) {
	unselectIt($("[elemId='" + $(elem).attr("id") + "']"));
	unselectIt($("[copyid='" + $(elem).attr("id") + "']"));
	
	$(elem).remove();

	getObjByAttr("id", $(elem).attr("id"))[0].isDressed = false;
	postContent(globalElements);
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
		}
	}
}

function favThis(elem) {
	event.stopPropagation();
	var thisImage = $(elem).parent().siblings("img");
	var prodSelector;
	if (!thisImage.parent().hasClass("disabled")) {
		prodSelector = thisImage.attr("id")
	} else {
		prodSelector = thisImage.attr("elemid")
	}
	if (!$(elem).hasClass("selected")) {
		$(elem).addClass("selected");
		thisImage.parent().addClass("favorite");
		getObjByAttr("id", prodSelector)[0].fav = true;
	} else {
		$(elem).removeClass("selected");
		thisImage.parent().removeClass("favorite");
		getObjByAttr("id", prodSelector)[0].fav = false;
	}
	postContent(globalElements);	
}

function initialize(callback) {
	for (i in recent) {
		$("#" + recent[i].id).parent().addClass("recent");
	}
	for (i in recomended) {
		$("#" + recomended[i].id).parent().addClass("recomended");
	}
	if (callback) {
		callback();
	}
}