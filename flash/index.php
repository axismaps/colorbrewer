<!-- saved from url=(0014)about:internet -->
<html lang="en">

<!-- 
Smart developers always View Source. 

This application was built using Adobe Flex, an open source framework
for building rich Internet applications that get delivered via the
Flash Player or to desktops via Adobe AIR. 

Learn more about Flex at http://flex.org 
// -->

<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="Description" content="Colorbrewer 2.0 is an online tool designed to help people select good color schemes for maps and other graphics." />
<meta name="Keywords" content="Colorbrewer, choropleth, colors, color scheme" />

<!--  BEGIN Browser History required section -->
<link rel="stylesheet" type="text/css" href="history/history.css" />
<!--  END Browser History required section -->

<title>Colorbrewer: Color Advice for Maps</title>
<script src="AC_OETags.js" language="javascript"></script>

<!--  BEGIN Browser History required section -->
<script src="history/history.js" language="javascript"></script>
<!--  END Browser History required section -->

<script type="text/javascript" src="swfobject.js"></script>

<style>
body {
	margin: auto;
	background-color: #acbbba;
	font-family:Arial, Helvetica, sans-serif;
	font-size:10px;
	color:#FFF;
	padding-top:10px;
	width: 1000px;
}
</style>
<script language="JavaScript" type="text/javascript">
<!--
// -----------------------------------------------------------------------------
// Globals
// Major version of Flash required
var requiredMajorVersion = 9;
// Minor version of Flash required
var requiredMinorVersion = 0;
// Minor version of Flash required
var requiredRevision = 124;
// -----------------------------------------------------------------------------
// -->
</script>
</head>

<body scroll="no">
<p></p>
<p></p>
<?php	
        echo "<script type=\"text/javascript\">\n";
        echo "    <!-- For version detection, set to min. required Flash Player version, or 0 (or 0.0.0), for no version detection. --> \n";
        echo "    var swfVersionStr = \"10.0.0\";\n";
        echo "    <!-- To use express install, set to playerProductInstall.swf, otherwise the empty string. -->\n";
        echo "    var xiSwfUrlStr = \"playerProductInstall.swf\";\n";
        echo "    var flashvars = {};\n";
        if ( isset($_GET['type']) ){
        	echo "    flashvars.type = \"" . $_GET['type'] . "\";\n";
		}
        if ( isset($_GET['scheme']) ){
        	echo "    flashvars.scheme = \"" . $_GET['scheme'] . "\";\n";
		}
        if ( isset($_GET['n']) ){
        	echo "    flashvars.n = \"" . $_GET['n'] . "\";\n";
		}
        echo "    var params = {};\n";
        echo "    params.quality = \"high\";\n";
        echo "    params.bgcolor = \"#000000\";\n";
        echo "    params.allowscriptaccess = \"always\";\n";
        echo "    var attributes = {};\n";
        echo "    attributes.id = \"ColorBrewer\";\n";
        echo "    attributes.name = \"ColorBrewer\";\n";
        echo "    attributes.align = \"middle\";\n";
        echo "    attributes.bgcolor = \"#869ca7\";\n";
        echo "    swfobject.embedSWF(\n";
        echo "        \"ColorBrewer.swf\", \"flashContent\", \n";
        echo "        1000, 630, \n";
        echo "        swfVersionStr, xiSwfUrlStr,\n"; 
        echo "        flashvars, params, attributes);\n";
		  echo "	<!-- JavaScript enabled so display the flashContent div in case it is not replaced with a swf object. -->\n";
		  echo "	swfobject.createCSS(\"#flashContent\", \"display:block;text-align:left;\");\n";
        echo "</script>\n";
        
    ?>
   <div id="main-container" style="width:100%;height:100%;float:left">
        <!-- SWFObject's dynamic embed method replaces this alternative HTML content with Flash content when enough 
			 JavaScript and Flash plug-in support is available. The div is initially hidden so that it doesn't show
			 when JavaScript is disabled.
		-->
        <div id="flashContent">
        	<p>
	        	To view this page ensure that Adobe Flash Player version 
				10.0.0 or greater is installed. 
			</p>
			<a href="http://www.adobe.com/go/getflashplayer">
				<img src="http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="Get Adobe Flash Player" />
			</a>
        </div>
<noscript>
  	<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
			id="ColorBrewer" width="1000" height="630"
			codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab">
			<param name="movie" value="ColorBrewer.swf" />
			<param name="quality" value="high" />
			<param name="bgcolor" value="#869ca7" />
			<param name="allowScriptAccess" value="sameDomain" />
			<embed src="ColorBrewer.swf" quality="high" bgcolor="#869ca7"
				width="1000" height="630" name="ColorBrewer" align="middle"
				play="true"
				loop="false"
				quality="high"
				allowScriptAccess="sameDomain"
				type="application/x-shockwave-flash"
				pluginspage="http://www.adobe.com/go/getflashplayer">
			</embed>
	</object>
</noscript>
<div style="float: left; margin-top: 15px">&copy; Cynthia Brewer, Mark Harrower and The Pennsylvania State University<br />
<a href="http://getsatisfaction.com/axismaps/products/axismaps_colorbrewer20" target="_blank">Support</a><br />
<a href="http://www.personal.psu.edu/cab38/ColorBrewer/ColorBrewer.html">Back to ColorBrewer 1.0</a></div>
<div style="float: right; margin-top: 10px"><a href="http://www.axismaps.com"><img alt="Axis Maps Logo" src="images/axis_logo.png" height="35" style="border:0"/></a></div>
<script type="text/javascript">
	var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
	document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
	try {
	var pageTracker = _gat._getTracker("UA-8516419-1");
	pageTracker._trackPageview();
	} catch(err) {}
</script>
</body>
</html>
