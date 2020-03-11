var schemeNames = {sequential: ["BuGn","BuPu","GnBu","OrRd","PuBu","PuBuGn","PuRd","RdPu","YlGn","YlGnBu","YlOrBr","YlOrRd"],
					singlehue:["Blues","Greens","Greys","Oranges","Purples","Reds"],
					diverging: ["BrBG","PiYG","PRGn","PuOr","RdBu","RdGy","RdYlBu","RdYlGn","Spectral"],
					qualitative: ["Accent","Dark2","Paired","Pastel1","Pastel2","Set1","Set2","Set3"] };

var visibleMap,
	selectedScheme = "BuGn",
	numClasses = 3;

$("#num-classes").change(function(){
	setNumClasses($(this).val());
});
$(".scheme-type").change(function(){
	setSchemeType($(this).attr("id"));
});
$("#color-system").change(updateValues);
$("#layers input").change(layerChange);
$("#filters input").change(showSchemes);

$("#transparency-slider").mousedown(function(){
	var max = $("#transparency-track").width();
	var handle = $(this);
	function handleMove(e){
		var l = Math.max(3,3+Math.min(e.pageX - $("#transparency-track").offset().left,max));
		handle.css("left",l);
		$("#county-map g").css("opacity",1-(l-4)/max);
	};
	function handleUp(){
		$(document).off( "mousemove",handleMove );
		$(document).off( "mouseup",handleUp );
	};
	$(document).on( "mousemove",handleMove );
	$(document).on( "mouseup",handleUp );
});

$("#road-color").spectrum({
	color: "#f33",
	showInput:true,
	change: function(color){
		if ( !$("#overlays").children().length ) return;
		$("#road-lines").css("stroke",color.toHexString());
	}
});
$("#city-color").spectrum({
	color: "#000",
	showInput:true,
	change: function(color){
		if ( !$("#overlays").children().length ) return;
		$("#cities").css("fill",color.toHexString());
	}
});
$("#border-color").spectrum({
	color: "#000",
	showInput:true,
	change: function(color){
		$("#county-map g").css("stroke",color.toHexString());
	}
});
$("#bg-color").spectrum({
	color: "#fff",
	showInput:true,
	change: function(color){
		$("#county-map rect").css("fill",color.toHexString());
	}
});

$("#terrain, #solid-color").change(function(){
	if ( $("#terrain").is(":checked") ){
		if ( !$("#terrain-img").length ) $("#map-container").prepend( $("<img id='terrain-img' src='map/terrain.jpg' />").css("left",-31).css("top",-58) );
		$("#county-map rect").css("opacity",0);
		if ( $("#transparency-slider").position().left < 4 ){
			$("#transparency-slider").css("left",$("#transparency-track").position().left + 43);
			$("#county-map g").css("opacity",.5);
		}
	} else {
		$("#county-map rect").css("opacity",1);
		if ( $("#transparency-slider").position().left == $("#transparency-track").position().left + 43 ){
			$("#transparency-slider").css("left",3);
			$("#county-map g").css("opacity",1);
		}
	}
});


function setNumClasses(n)
{
	numClasses = n;
	showSchemes();
}

var selectedSchemeType;
function setSchemeType(type)
{
	selectedSchemeType = type;

	$( "#num-classes option" ).removeAttr( "disabled" );
	switch( selectedSchemeType )
	{
		case "sequential":
			if( $( "#num-classes" ).val() >= 10 )
			{
				$( "#num-classes" ).val( 9 );
				numClasses = 9;
			}
			$( "#num-classes option[name=10], #num-classes option[name=11], #num-classes option[name=12]" ).attr( "disabled", "disabled" );
			break;
		case "diverging":
			if( $( "#num-classes" ).val() >= 12 )
			{
				$( "#num-classes" ).val( 11 );
				numClasses = 11;
			}
			$( "#num-classes option[name=12]" ).attr( "disabled", "disabled" );
			break;
	}
	showSchemes();
}

function showSchemes()
{
	$("#ramps").empty();
	for ( var i in schemeNames[selectedSchemeType]){
		if ( checkFilters(schemeNames[selectedSchemeType][i]) == false ) continue;
		var ramp = $("<div class='ramp "+schemeNames[selectedSchemeType][i]+"'></div>"),
			svg = "<svg width='15' height='75'>";
		for ( var n = 0; n < 5; n++ ){
			svg += "<rect fill="+colorbrewer[schemeNames[selectedSchemeType][i]][5][n]+" width='15' height='15' y='"+n*15+"'/>";
		}
		svg += "</svg>";
		$("#ramps").append(ramp.append(svg).click( function(){
			if ( $(this).hasClass("selected") ) return;
			setScheme( $(this).attr("class").substr(5) );
		}));
	}
	if ( selectedSchemeType == "sequential" ){
		$("#scheme1").css("width","160px");
		$("#multi").show().text("Multi-hue:");
		$("#scheme2").css("width","90px");
		$("#single").show().text("Single hue:");

		$("#singlehue").empty().css("display","inline-block");
		for ( i in schemeNames.singlehue){
			if ( checkFilters(schemeNames.singlehue[i]) == false ) continue;
			var ramp = $("<div class='ramp "+schemeNames.singlehue[i]+"'></div>"),
				svg = "<svg width='15' height='75'>";
			for ( var n = 0; n < 5; n++ ){
				svg += "<rect fill="+colorbrewer[schemeNames.singlehue[i]][5][n]+" width='15' height='15' y='"+n*15+"'/>";
			}
			svg += "</svg>";
			$("#singlehue").append(ramp.append(svg).click( function(){
				if ( $(this).hasClass("selected") ) return;
				setScheme( $(this).attr("class").substr(5) );
			}));
		}
	} else {
		$("#scheme1").css("width","100%");
		$("#multi").hide();
		$("#singlehue").empty();
		$("#single").hide();
	}

	$(".score-icon").show();
	$("#color-system").show();
	if ( $(".ramp."+selectedScheme)[0] ){
		setScheme( selectedScheme );
	} else if ( $("#ramps").children().length ) setScheme( $("#ramps .ramp:first-child").attr("class").substr(5) );
	else clearSchemes();
}

function clearSchemes()
{
	$("#counties g path").css("fill","#ccc");
	$("#color-chips").empty();
	$("#color-values").empty();
	$("#ramps").css("width","100%");
	$("#scheme-name").html("");
	$(".score-icon").hide();
	$("#color-system").hide();
	$("#ramps").append("<p>No color schemes match these criteria.</p><p>Please choose fewer data classes, a different data type, and/or fewer filtering options.</p>");
}

function setScheme(s)
{
	$("#county-map g").removeClass(selectedScheme).addClass(s);
	$(".ramp.selected").removeClass("selected");
	selectedScheme = s;
	$(".ramp."+selectedScheme).addClass("selected");
	$("#scheme-name").html(numClasses+"-class "+selectedScheme);
	applyColors();
	drawColorChips();
	$("#permalink").val("https://colorbrewer2.org/?type="+selectedSchemeType+"&scheme="+selectedScheme+"&n="+numClasses);
	window.location.hash = "type="+selectedSchemeType+"&scheme="+selectedScheme+"&n="+numClasses;

	updateValues();

	var cssString = "";
	for ( var i = 0; i < numClasses; i ++ ){
		cssString += "."+selectedScheme+" .q"+i+"-"+numClasses+"{fill:" + colorbrewer[selectedScheme][numClasses][i] + "}";
		if ( i < numClasses - 1 ) cssString += " ";
	}
	$("#copy-css input").val(cssString);

	$(".score-icon").attr("class","score-icon");
	var f = checkColorblind(s);
	$("#blind-icon").addClass( !f ? "bad" : (f == 1 ? "ok" : "maybe") ).attr("title",numClasses+"-class "+selectedScheme + " is " + getWord(f)+"color blind friendly");
	f = checkCopy(s);
	$("#copy-icon").addClass( !f ? "bad" : (f == 1 ? "ok" : "maybe") ).attr("title",numClasses+"-class "+selectedScheme + " is " + getWord(f)+"photocopy friendly");
	f = checkScreen(s);
	$("#screen-icon").addClass( !f ? "bad" : (f == 1 ? "ok" : "maybe") ).attr("title",numClasses+"-class "+selectedScheme + " is " + getWord(f)+"LCD friendly");
	f = checkPrint(s);
	$("#print-icon").addClass( !f ? "bad" : (f == 1 ? "ok" : "maybe") ).attr("title",numClasses+"-class "+selectedScheme + " is " + getWord(f)+"print friendly");

	function getWord(w){
		if ( !w ) return "not ";
		if ( w == 1 ) return "";
		if ( w == 2 ) return "possibly not ";
	}
}

/* function getJSON()
{
	var jsonString = "[";
	for ( var i = 0; i < numClasses; i ++ ){
		jsonString += "'" + colorbrewer[selectedScheme][numClasses][i] + "'";
		if ( i < numClasses - 1 ) jsonString += ",";
	}
	jsonString += "]";

	return jsonString;
} */

function checkFilters(scheme,f)
{
	if ( !colorbrewer[scheme][numClasses] ) return false;
	if ( $("#blindcheck").is(":checked") && checkColorblind(scheme) != 1 ) return false;
	if ( $("#printcheck").is(":checked") && checkPrint(scheme) != 1 ) return false;
	if ( $("#copycheck").is(":checked") && checkCopy(scheme) != 1) return false;
	return true;
}
function checkColorblind(scheme)
{
	return colorbrewer[scheme].properties.blind.length > 1 ? colorbrewer[scheme].properties.blind[numClasses-3] : colorbrewer[scheme].properties.blind[0];
}
function checkPrint(scheme)
{
	return colorbrewer[scheme].properties.print.length > 1 ? colorbrewer[scheme].properties.print[numClasses-3] : colorbrewer[scheme].properties.print[0];
}
function checkCopy(scheme)
{
	return colorbrewer[scheme].properties.copy.length > 1 ? colorbrewer[scheme].properties.copy[numClasses-3] : colorbrewer[scheme].properties.copy[0];
}
function checkScreen(scheme)
{
	return colorbrewer[scheme].properties.screen.length > 1 ? colorbrewer[scheme].properties.screen[numClasses-3] : colorbrewer[scheme].properties.screen[0];
}

function applyColors()
{
	if ( !colorbrewer[selectedScheme][numClasses] ){
		$("#counties g path").css("fill","#ccc");
		return;
	}
	for ( var i = 0; i < numClasses; i++ ){
		if ( !$("#borderscheck").is(":checked") ) $("#county-map g .q"+i+"-"+numClasses).css("stroke",colorbrewer[selectedScheme][numClasses][i]);
		$(".q"+i+"-"+numClasses).css("fill",colorbrewer[selectedScheme][numClasses][i]);
	}
}

function drawColorChips()
{
	var svg = "<svg width='24' height='270'>";
	for ( var i = 0; i < numClasses; i++ ){
		svg += "<rect fill="+colorbrewer[selectedScheme][numClasses][i]+" width='24' height='"+Math.min(24,parseInt(265/numClasses))+"' y='"+i*Math.min(24,parseInt(265/numClasses))+"'/>";
	}
	$("#color-chips").empty().append(svg);
	updateValues();
}

function updateValues()
{
	$("#color-values").empty();
	var str = "";
	var s = $("#color-system").val().toLowerCase();
	var jsonString = "[";
	$("#color-chips rect").each(function(i){
		var val = ( s == "cmyk" ? getCMYK(selectedScheme,numClasses,i) : getColorDisplay($(this).css("fill")) );
		str += val + "\n";

		var jsonVal = getColorDisplay($(this).css("fill"));
		if ( s == "hex" ) {
			jsonString += "'" + jsonVal + "'";
		} else {
			jsonString += "'rgb(" + jsonVal + ")'";
		}
		if ( i < numClasses - 1 ) jsonString += ",";
	});
	jsonString += "]";
	str = str.replace( /\n$/, "" );

	$("#color-values").append("<textarea readonly style='line-height:"+Math.min(24,parseInt(265/numClasses))+"px; height:"+Math.min(24,parseInt(265/numClasses))*numClasses+"px'>"+str+"</textarea>");
	$( "#ase" ).attr( "href", "export/ase/" + selectedScheme + "_" + numClasses + ".ase" );
	$( "#gpl" ).attr( "href", "export/gpl/" + selectedScheme + "_" + numClasses + ".gpl" );
	$("#copy-json input").val(jsonString);
}

function getColorDisplay(c,s)
{
	if ( c.indexOf("#") != 0 ){
		var arr = c.replace(/[a-z()\s]/g,"").split(",");
		var rgb = {r:arr[0],g:arr[1],b:arr[2]};
	}
	s = s || $("#color-system").val().toLowerCase();
	if ( s=="hex" ){
		if ( rgb ) return rgbToHex(rgb.r,rgb.g,rgb.b);
		return c;
	}
	if ( s=="rgb" || s=="cmyk" ){
		if (!rgb) rgb = hexToRgb(c);
		return rgb.r + "," + rgb.g + "," + rgb.b;
	}

}
function getCMYK( scheme, classes, n ){
	return cmyk[scheme][classes][n].toString();
}
var highlight;
$("#counties").svg({
	loadURL: "map/map.svg",
	onLoad: function(){
		$("#counties svg")
			.attr("id","county-map")
			.attr("width",756)
			.attr("height",581);
		$("#map-container").css("background-image","none");
		init();
		$("#counties path").mouseover(function(){
			var c = $(this).css("fill");
			var cl = $(this).attr("class").match(new RegExp("q[0-9]+-"+numClasses))[0];
			cl = parseInt(cl.substring(cl.indexOf("q")+1,cl.indexOf("-"))) + 1;
			$("#probe").empty().append(
				"<p>"+selectedScheme+" class " + cl +"<br/>"+
				"RGB: " + getColorDisplay(c,"rgb")+"<br/>"+
				"CMYK: " + getCMYK(selectedScheme,numClasses,cl-1)+"<br/>"+
				"HEX: " + getColorDisplay(c,"hex")+"</p>"
			);
			highlight = $(this).clone().css({"pointer-events":"none","stroke":"#000","stroke-width":"2"}).appendTo("#county-map g");
			$("#probe").show();
		});
		$("#counties path").mousemove(function(e){
			$("#probe").css({left: Math.min(920,e.pageX - $("#wrapper").offset().left + 10), top: e.pageY - $("#wrapper").offset().top - 75 });
		});
		$("#counties path").mouseout(function(){$("#probe").hide();highlight.remove();});
	}
});

function init()
{
	var type = getParameterByName("type") || "sequential";
	var scheme = getParameterByName("scheme") || "BuGn";
	var n = getParameterByName("n") || 3;
	$("#"+type).prop("checked",true);
	$("#num-classes").val(n);
	setSchemeType(type);
	setNumClasses(n);
	setScheme(scheme);
}

function layerChange()
{
	switch( $(this).attr("id") ){
		case "roadscheck":
		if ( $(this).is(":checked") ){
			if ( !$("#overlays").children().length )
				loadOverlays("roads");
			else
				$("#roads").show();
		} else {
			$("#roads").hide();
		}
		break;

		case "citiescheck":
		if ( $(this).is(":checked") ){
			if ( !$("#overlays").children().length )
				loadOverlays("cities");
			else
				$("#cities").show();
		} else {
			$("#cities").hide();
		}
		break;

		case "borderscheck":
		if ($(this).is(":checked")) $("#county-map g").children().css({"stroke":"inherit","stroke-width":"0.50"});
		else {
			var i=numClasses; while(i--){
				$("#county-map g .q"+i+"-"+numClasses).css({"stroke":colorbrewer[selectedScheme][numClasses][i],"stroke-width":"1"});
			}
		}
	}
}

function loadOverlays(o)
{
	$("#overlays").svg({
		loadURL: "map/overlays.svg",
		onLoad: function(){
			$("#overlays svg").attr("width",756).attr("height",581);
			if ( o == "cities" ) $("#roads").hide();
			else $("#cities").hide();
			$("#cities").css("fill",$("#city-color").spectrum("get").toHexString());
			$("#road-lines").css("stroke",$("#road-color").spectrum("get").toHexString());
		}
	});
}
$(".learn-more, #how, #credits, #downloads").click(function(e){
	e.stopPropagation();
	var page;
	switch( $(this).attr("id") ){
		case "number-learn-more":
		$("#learnmore-title").html("NUMBER OF DATA CLASSES");
		page = "number.html";
		break;

		case "schemes-learn-more":
		$("#learnmore-title").html("TYPES OF COLOR SCHEMES");
		page = "schemes.html";
		break;

		case "filters-learn-more":
		$("#learnmore-title").html("USABILITY ICONS");
		page = "usability.html";
		break;

		case "how":
		$("#learnmore-title").html("HOW TO USE: MAP DIAGNOSTICS");
		page = "howtouse.html";
		break;

		case "credits":
		$("#learnmore-title").html("CREDITS");
		page = "credits.html";
		break;

		case "downloads":
		$("#learnmore-title").html("DOWNLOADS");
		page = "downloads.html";
		break;

		case "context-learn-more":
		$("#learnmore-title").html("MAP CONTEXT and BACKGROUND");
		page = "context.html";
		break;
	}
	if ( page ){
		$("#learnmore #content").load("learnmore/"+page,function(){
			$("#learnmore").show().css("margin-top",($("#wrapper").height()/2-$("#learnmore").height()/2));
		});
		$("#mask").show();
	}
});
$("#learnmore #close, #mask").click(function(){
	$("#learnmore #content").empty();
	$("#learnmore, #mask").hide();
});

$( "#export #tab" ).toggle(
	function(){
		$( "#export" ).animate( { "left" : "265px" } );
	},
	function(){
		$( "#export" ).animate( { "left" : "0px" } );
	})

function rgb2cmyk (r,g,b) {
	var computedC = 0;
	var computedM = 0;
	var computedY = 0;
	var computedK = 0;

	// BLACK
	if (r==0 && g==0 && b==0) {
	computedK = 1;
	return [0,0,0,100];
	}

	computedC = 1 - (r/255);
	computedM = 1 - (g/255);
	computedY = 1 - (b/255);

	var minCMY = Math.min(computedC,
			  Math.min(computedM,computedY));
	computedC = (computedC - minCMY) / (1 - minCMY) ;
	computedM = (computedM - minCMY) / (1 - minCMY) ;
	computedY = (computedY - minCMY) / (1 - minCMY) ;
	computedK = minCMY;

	return [Math.round(computedC*100),Math.round(computedM*100),Math.round(computedY*100),Math.round(computedK*100)];
}
function rgbToHex(r, g, b) {
    return "#" + ( (1 << 24) | (r << 16) | (g << 8) | b ).toString(16).slice(1);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&#]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null)
    return null;
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}
