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

function copyProduct(product, destination) {
	var type = $(destination).attr("id").substr(8);
	var content = [];
	var listId = getContent(type);
	//pega os elementos ja existentes
	if (type === "recent") {
		for (var i = 0; i < listId.length; i++) {
			content.push(getObjByAttr("id", listId[i]["id"]));
		}
	} else if (type === "fav") {
		for (var i = 0; i < Object.keys(globalElements).length; i++) {
			var category = Object.keys(globalElements)[i];
			$.grep(globalElements[category], function(j){
				if (j["fav"] === true) {
					content.push(j);
				}
			});
		}
	} else if (content === undefined) {
		content = [];
	};

	//adiciona o novo
	if (content.length > 0 && product !== [] && product !== null) {
		for (var i = 0; i < content.length; i++) { //remove repetidos
			if (content[i].id === product.id) {
				content.splice(i,1);
			}
		}
		if (content.length >= 11) {
			content.splice(11,1);
		}
		content.splice(0,0,product);
	} else if (product !== [] && product !== null) {
		content.push(product);
	}
	
	//atualiza objetos
	if (type !== "fav") {
		postContent(content, type);
	} else {
		postContent(globalElements);
	}
	
	//cria
	createBtnsCat(destination, content);
}

function createBtnsCat(parent, list) {
	if ($(parent).children($(".catElements")).length > 0) {
		$(parent).children($(".catElements")).remove();
	}
	var ulElements = $("<ul class='catElements fLeft'></ul>");
	var category = $(parent).attr("id").substr(8);

	$(list).each(function(i, e) {

		var thisElem = $("<li class='bShadowLight rCSmall border fLeft' ondrag='dragIt(event, this)' onclick='selectProd(this)' draggable=true></li>");

		var thisImg = $("<img class='draggable " + e.category + "' ondrag='dragIt(event, this)' src='images/" + e.id + ".png'>");
		    thisImg.attr("title", e.title);
		    thisImg.attr("type", e.type);

		var thisFav = $("<label class='fav' onclick='favThis(this)'></label>");

		//nao categorias-copia
		if (category !== "recent" && category !== "fav" && category !== "recomended") {
			thisImg.attr("id", e.id);	
			if (e.isDressed) {
				thisElem.addClass("toSelect");
			}
		} else {
			thisImg.attr("copyid", e.id);
			thisImg.addClass("copy");
			if (e.isDressed) {
				thisElem.addClass("disabled");
			}
		}
		if (e.fav === true) { //AQUI
			console.log("FAV");
			thisElem.addClass("favorite");
			thisFav.addClass("selected");
		}

		//cria labels para roupas
		if (thisImg.hasClass("roupas")) {
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

		//seta posição
		if (e.position !== "" && e.position !== undefined && e.position !== null) {
			thisImg.css("top", e.position.top)
			       .css("left", e.position.left);
		}
		if (e.layer !== "" && e.layer !== undefined && e.layer !== null) {
			thisImg.css("z-index", e.layer);
		}

		//appends
		ulElements.append(thisElem);
		$(thisLabel).append(thisFav);
		thisElem.append(thisImg, thisLabel);
	});

	$(parent).append(ulElements);
	$(ulElements).children("li:nth-child(3n)").css("margin-right", 0);
	if ($(ulElements).children().length > 12) {
		scrollPages($(parent), list);
	}

	setLabels($(".roupas").parent());
	centerImg($(".catElements li"));
}

function createElements(objectElem) {
	var category = $(objectElem).attr("id").substr(8);

	createBtnsCat($(objectElem), $(globalElements[category]));
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
	$(".containerContent").show();
	$(".pages").hide();
	$(".menu li.selected").removeClass("selected");
	$(".pages li.active").removeClass("selected");
	$(".pages li").eq($(tab).index()).removeClass("active");
	$(".containerMenu li.active").removeClass("active");
	$(".containerContent li.active").removeClass("active");
	$(tab).addClass("active");
	$(".containerContent>li").eq($(tab).index()).addClass("active");
}

function changePage(btnClicked) {
	$(".containerContent").hide();
	$(".pages").show();
	$(".menu li.selected").removeClass("selected");
	$(".pages li.selected").removeClass("selected");
	$(".containerMenu li.active").removeClass("active");
	$(".containerContent li.active").removeClass("active");
	$(".pages>li").eq($(btnClicked).index()).addClass("selected");
	$(btnClicked).addClass("selected");
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

function setDressedPieces(parent) {
	var dressed = [];
	$(parent).find(".dressed").each(function(i, e) {
		var prodId = $(e).attr("id");
		if (getObjByAttr("id", prodId).length > 0) {
			dressed.push(getObjByAttr("id", prodId));
		}
	});
	//postContent(dressed, "dressed");
}

function getObjByAttr(attr, value) {
	var theObject;
	for (var i = 0; i < Object.keys(globalElements).length; i++) {
		var category = Object.keys(globalElements)[i];
		$.grep(globalElements[category], function(j){
			if (j[attr] === value) {
				theObject = j;
			}
		});
	}
	return theObject;
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

	setDressedPieces($("#canvas"));

	getObjByAttr("id", $(elem).attr("id")).isDressed = true;

	copyProduct(getObjByAttr("id", $(elem).attr("id")), $("#content_recent"));

	selectIt($(elem).parent());
}

function undressIt(elem) {
	unselectIt($("[elemId='" + $(elem).attr("id") + "']"));
	unselectIt($("[copyid='" + $(elem).attr("id") + "']"));
	$(elem).remove();
	setDressedPieces($("#canvas"));
	getObjByAttr("id", $(elem).attr("id")).isDressed = false;
	postContent(globalElements);
}

function selectProd(elem) {
	if ($(elem).find(".copy").length > 0) {
		if($("#" + $(elem).find(".copy").attr("copyid")).parent().attr("id") === "canvas") {
			$("#" + $(elem).find(".copy").attr("copyid")).click();
		} else {
			$("#" + $(elem).find(".copy").attr("copyid")).parent().click();
		}
		//console.log($("#" + $(elem).find(".copy").attr("copyid")));
	} else {
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
}

function favThis(elem) {
	event.stopPropagation();
	var thisImage = $(elem).parent().siblings("img");

	if (!thisImage.hasClass("copy")) {
		if (!$(elem).hasClass("selected")) {
			$(elem).addClass("selected");
			thisImage.parent().addClass("favorite");
			getObjByAttr("id", thisImage.attr("id")).fav = true;
			copyProduct(getObjByAttr("id", thisImage.attr("id")), $("#content_fav"));
		} else {
			$(elem).removeClass("selected");
			thisImage.parent().removeClass("favorite");
			getObjByAttr("id", thisImage.attr("id")).fav = false;
			copyProduct(null, $("#content_fav"));
		}
	} else {
		console.log("copia.");
		if($("#" + thisImage.attr("id")).hasClass("dressed")) {
			var trueFav = $("[elemid='" + thisImage.attr("id") + "']").parent().find(".fav");
		} else {
			var trueFav = $("#" + thisImage.attr("id")).parent().find(".fav");
		}
		trueFav.click();			
	}
}

function initialize(callback) {
	var recomended = [];
	for (var i = 0; i < getContent("recomended").length; i++) {
		recomended.push(getObjByAttr("id", getContent("recomended")[i]["id"]));
	}
	var recent = [];
	for (var i = 0; i < getContent("recent").length; i++) {
		recent.push(getObjByAttr("id", getContent("recent")[i]["id"]));
	}

	createBtnsCat($("#content_recomended"), recomended);
	createBtnsCat($("#content_recent"), recent);

	if (callback) {
		callback();
	}
}