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
$("#scheme-type").change(function(){
	setSchemeType($(this).val());
});
$("#system input").change(updateValues);
$("#layers input").change(layerChange);

$("#transparency-slider").mousedown(function(){
	var max = $("#transparency-track").width();
	var handle = $(this);
	function handleMove(e){
		var l = Math.max(23,23+Math.min(e.pageX - $("#transparency-track").offset().left,max));
		handle.css("left",l);
		$("#county-map g").css("opacity",1-(l-24)/max);
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
		if ( !$("#terrain-img").length ) $("#map-container").prepend( $("<img id='terrain-img'/>").attr("src","terrain.jpg").css("left",-31).css("top",-58) );
		$("#county-map rect").css("opacity",0);
		if ( $("#transparency-slider").position().left < 24 ){
			$("#transparency-slider").css("left",$("#transparency-track").position().left + 45);
			$("#county-map g").css("opacity",.5);
		} 
	} else {
		$("#county-map rect").css("opacity",1);
		if ( $("#transparency-slider").position().left == $("#transparency-track").position().left + 45 ){
			$("#transparency-slider").css("left",23);
			$("#county-map g").css("opacity",1);
		} 
	}
});


function setNumClasses(n)
{
	$("#county-map g").removeClass("q"+numClasses).addClass("q"+n);
	numClasses = n;
	drawColorChips();
	applyColors();
}

function setSchemeType(type)
{
	$("#ramps").empty();
	for ( var i in schemeNames[type]){
		var ramp = $("<div class='ramp "+schemeNames[type][i]+"'></div>"),
			svg = "<svg width='15' height='75'>";
		for ( var n = 0; n < 5; n++ ){
			svg += "<rect fill="+colorbrewer[schemeNames[type][i]][5][n]+" width='15' height='15' y='"+n*15+"'/>";
		}
		svg += "</svg>";
		$("#ramps").append(ramp.append(svg).click( function(){
			setScheme( $(this).attr("class").substr(5) );
		}));
	}
	if ( type == "sequential" ){
		$("#ramps").css("width","160px").append("<p>multihue</p>");
		$("#singlehue").empty().css("display","inline-block");
		for ( i in schemeNames.singlehue){
			var ramp = $("<div class='ramp "+schemeNames.singlehue[i]+"'></div>"),
				svg = "<svg width='15' height='75'>";
			for ( var n = 0; n < 5; n++ ){
				svg += "<rect fill="+colorbrewer[schemeNames.singlehue[i]][5][n]+" width='15' height='15' y='"+n*15+"'/>";
			}
			svg += "</svg>";
			$("#singlehue").append(ramp.append(svg).click( function(){
				setScheme( $(this).attr("class").substr(5) );
			}));
		}
		$("#singlehue").append("<p>single hue</p>");
	} else {
		$("#ramps").css("width","100%");
		$("#singlehue").hide();
	}
	setScheme(schemeNames[type][0]);
}

function setScheme(s)
{
	$("#county-map g").removeClass(selectedScheme).addClass(s);
	$(".ramp.selected").removeClass("selected");
	selectedScheme = s;
	$(".ramp."+selectedScheme).addClass("selected");
	$("#scheme-name").html(selectedScheme);
	applyColors();
	drawColorChips();
}

function applyColors()
{
	if ( !colorbrewer[selectedScheme][numClasses] ) var mug = 0; // show some message
	for ( var i = 0; i < numClasses; i++ ){
		if ( !$("#borderscheck").is(":checked") ) $("#county-map g .q"+i+"-"+numClasses).css("stroke",colorbrewer[selectedScheme][numClasses][i]);
		$(".q"+i+"-"+numClasses).css("fill",colorbrewer[selectedScheme][numClasses][i]);
	}
}

function drawColorChips()
{
	var svg = "<svg width='25' height='200' class='"+selectedScheme+" q"+numClasses+"'>";
	for ( var i = 0; i < numClasses; i++ ){
		svg += "<rect fill="+colorbrewer[selectedScheme][numClasses][i]+" width='25' height='"+Math.min(25,parseInt(200/numClasses))+"' y='"+i*Math.min(25,parseInt(200/numClasses))+"'/>";
	}
	$("#color-chips").empty().append(svg);
	updateValues();
}

function updateValues()
{
	$("#color-values").empty();
	var str = "";
	$("#color-chips rect").each(function(){
		str += getColorDisplay($(this).css("fill")) + "<br/>";
	});
	$("#color-values").append("<p style='line-height:"+Math.min(25,parseInt(200/numClasses))+"px'>"+str+"</p>");
}

function getColorDisplay(c,s)
{
	if ( c.indexOf("#") != 0 ){
		var arr = c.replace(/[a-z()\s]/g,"").split(",");
		var rgb = {r:arr[0],g:arr[1],b:arr[2]};
	}
	s = s || ( $("#hex").is(":checked") ? "hex" : ($("#rgb").is(":checked") ? "rgb":"cmyk") );
	if ( s=="hex" ){
		if ( rgb ) return rgbToHex(rgb.r,rgb.g,rgb.b);
		return c;
	}
	if ( s=="rgb" ){
		if (!rgb) rgb = hexToRgb(c);
		return rgb.r + "," + rgb.g + "," + rgb.b;
	}
	if ( s=="cmyk" ){
		if (!rgb) rgb = hexToRgb(c);
		var cmyk = rgb2cmyk(rgb.r,rgb.g,rgb.b);
		return cmyk[0] + "," + cmyk[1] + "," + cmyk[2] + "," + cmyk[3];
	}
}
$("#counties").svg({
	loadURL: "map.svg",
	onLoad: function(){
		$("#counties svg")
			.attr("id","county-map")
			.attr("width","100%")
			.attr("height","100%");
		setSchemeType("sequential");
		setNumClasses(numClasses);
		$("#counties path").mouseover(function(){
			var c = $(this).css("fill");
			var cl = $(this).attr("class").match(new RegExp("q[0-9]+-"+numClasses))[0];
			cl = parseInt(cl.substring(cl.indexOf("q")+1,cl.indexOf("-"))) + 1;
			$("#probe").empty().append(
				"<p>Class " + cl +"<br/>"+
				"RGB: " + getColorDisplay(c,"rgb")+"<br/>"+
				"CMYK: " + getColorDisplay(c,"cmyk")+"<br/>"+
				"HEX: " + getColorDisplay(c,"hex")+"</p>"
			);
			$("#probe").show();
		});
		$("#counties path").mousemove(function(e){
			$("#probe").css({left: e.pageX + 10, top: e.pageY - 70 });
		});
		$("#counties path").mouseout(function(){$("#probe").hide()});
	}
});

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
		if ($(this).is(":checked")) $("#county-map g").children().css("stroke","inherit");
		else {
			var i=numClasses; while(i--){
				$("#county-map g .q"+i+"-"+numClasses).css("stroke",colorbrewer[selectedScheme][numClasses][i]);
			}
			//$("#county-map g").css("stroke","none");
		}
	}
}

function loadOverlays(o)
{
	$("#overlays").svg({
		loadURL: "overlays.svg",
		onLoad: function(){
			$("#overlays svg").attr("width","100%").attr("height","100%");
			if ( o == "cities" ) $("#roads").hide();
			else $("#cities").hide();
			$("#cities").css("fill",$("#city-color").spectrum("get").toHexString());
			$("#road-lines").css("stroke",$("#road-color").spectrum("get").toHexString());
		}
	});
}

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