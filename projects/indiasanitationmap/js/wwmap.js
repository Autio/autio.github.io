var wwMap = (function() {

var config, allData, mapData, translations,
	selectedCountry, selectedYear, selectedSource,
	path, mapsvg, colorScale, mapSlider, tooltipdiv,
	graphsvg, lgX, lgY, usePercentages, numberUnit,
	colorDomain, extColorDomain, activeDomain, level, maxY, optimalValue;
	
// from http://stackoverflow.com/a/979995/3189
var QueryString = function () {
	// This function is anonymous, is executed immediately and
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
			// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], pair[1] ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(pair[1]);
		}
	}
	return query_string;
} ();

function replaceBodyWithFallbackImage() {
	// delete the main html
	// replace with img tag with screenshot of data vis, and some text
	// might need to dynamically load jquip to do this with old browsers
	var wrapper = document.getElementById("wrapperdiv");
	document.body.removeChild(wrapper);

	var explanation = document.getElementById("fallback-text");
	explanation.className = "show";

	var image = document.createElement("img");
	image.setAttribute("src", "images/fallback.png");
	document.body.appendChild(image);
}

function numberWithCommas(number) {
	// split on decimal point - we discard after decimal
	var parts = number.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatPercent(number) {
	if (number <= 100) {
		return Math.round(number).toString();
	} else {
		// Handles null values
		if(typeof number === 'undefined') {
			return number.toFixed(1); 
		}
		else return 0
	}
}

function formatNumber(number){
	return Math.round(number).toString();
}

function capitaliseFirstLetter(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getTranslation(translationKey, capitalise) {

	capitalise = (typeof capitalise === "undefined") ? false : capitalise;
	if (translations.hasOwnProperty(translationKey)) {
		if (capitalise) {
			return capitaliseFirstLetter(translations[translationKey]);
		} else {
			return translations[translationKey];
		}
	} else {
		console.log("Could not find translation of " + translationKey);
	}
}

function setSelectionText(selector, translationKey, capitalise) {
	var translated = getTranslation(translationKey, capitalise);
	if (translated) {
		d3.select(selector).text(translated);
	}
}

function setSelectionHtml(selector, translationKey, capitalise) {
	var translated = getTranslation(translationKey, capitalise);
	if (translated) {
		d3.select(selector).html(translated);
	}
}

function setSelectionTitle(selector, translationKey, capitalise) {
	var translated = getTranslation(translationKey, capitalise);
	if (translated) {
		d3.select(selector).attr("title", translated);
	}
}

/* translate the text up to the first html tag
 */
function setSelectionLeadingText(selector, translationKey, capitalise) {
	var translated = getTranslation(translationKey, capitalise);
	if (translated) {
		var selection = d3.select(selector);
		var origHtml = selection.html();
		selection.html(translated + origHtml.substring(origHtml.indexOf('<')));
	}
}

/* Update the text in the file
 */
function updateStaticText() {
	// map info section
	setSelectionText("#fallback-title", "India Sanitation Map");
	setSelectionHtml("#fallback-text", "browser fallback");
	setSelectionLeadingText("#map-info-title", "map info title");
	setSelectionLeadingText(".map-info > h1 > span.big", selectedSource);
	setSelectionHtml(".instructions", selectedSource + "instructions");
	setSelectionText("#select-indicator1-source", "indicator1", true);
	setSelectionText("#select-indicator2-source", "indicator2", true);
	setSelectionText("#select-indicator3-source", "indicator3", true);
	setSelectionText("#reset-button", "Reset");
	setSelectionText("#level-button", "Switch level");
	
	// sharing section
	setSelectionLeadingText(".social-share > h2", "share");
	setSelectionTitle("#twitter-search-link", "follow India sanitation map");
	setSelectionTitle(".ss-share-link.ico-facebook", "share on facebook");
	setSelectionTitle(".ss-share-link.ico-twitter", "share on twitter");
	setSelectionTitle(".ss-share-link.ico-google", "share on google");
	setSelectionTitle(".ss-share-link.ico-linkedin", "share on linkedin");
	setSelectionTitle(".ss-share-link.ico-embed", "embed this map");
	setSelectionLeadingText(".embed-example", "you can embed this map");

	// targets section
	setSelectionText(".targets-title", "Everyone, Everywhere by 2030");
	setSelectionText(".currently > .targets-section-title", "currently");
	setSelectionText(".for-target > .targets-section-title", "for targets");
	setSelectionText(".for-target > .targets-detail", "extra people per year");
	setSelectionHtml(".targets-percent", "That is just % of the population");

	setSelectionText(".map-description > h3", "about this map");
	setSelectionText("#description-about", "this map shows which ...");
	setSelectionText("#description-more-info > a", "find out more");

	// footer
	setSelectionText("#map-by", "map by");
}

function toggleEmbedCode() {
	var embedCode = d3.select(".embed-example");
	if (embedCode.style("display") == "none") {
		embedCode.style("display", "block");
	} else {
		embedCode.style("display", "none");
	}
}

function updateSocialText() {
	// work out iframe parent link - from http://stackoverflow.com/a/7739035/3189
	var pageUrl = (window.location != window.parent.location) ? document.referrer: document.location;
	var encodedUrl = encodeURIComponent(pageUrl);
	var hashTag;
	if (selectedSource == "indicator1") {
		hashTag = config.twitterHashTagWater;
	} else {
		hashTag = config.twitterHashTagSanitation;
	}
	var twitterText =
		encodeURIComponent(getTranslation("twitter share text " + selectedSource));
	var otherText =
		encodeURIComponent(getTranslation("other share text " + selectedSource));
	var title =
		encodeURIComponent(getTranslation("map info title"));

	d3.select("#twitter-search-link")
		.attr("href", "https://twitter.com/#" + hashTag)
		.attr("title", getTranslation("follow India sanitation map"))
		.attr("target", "_top")
		.text(" #" + hashTag);

	d3.select(".ss-share-link.ico-facebook")
		.attr("href", "https://www.facebook.com/sharer.php?s=100&p[title]=" + title +
			"&p[summary]=" + otherText +
			"&p[url]=" + encodedUrl);

	d3.select(".ss-share-link.ico-twitter")
		.attr("href", "https://twitter.com/share?text=" + twitterText +
			"&url=" + encodedUrl +
			"&hashtags=africawaterweek");

	d3.select(".ss-share-link.ico-google")
		.attr("href", "https://plus.google.com/share?url=" + encodedUrl);

	d3.select(".ss-share-link.ico-linkedin")
		.attr("href", "https://www.linkedin.com/shareArticle?mini=true&url=" + encodedUrl +
			"&title=" + title +
			"&summary=" + otherText);

	// looks like facebook uses meta tags, so insert some stuff there
	var metaTag = document.getElementsByTagName('meta');
	for (var i = 0; i < metaTag.length; i++) {
		if (metaTag[i].getAttribute("property") == "og:description") {
			metaTag[i].content = otherText;
		}
		if (metaTag[i].getAttribute("property") == "og:title") {
			metaTag[i].content = title;
		}
	}

	// update the iframe link with the query parameters
	var embedPre = d3.select(".embed-example > pre");
	embedPre.text(
		embedPre.text().replace("index.html", "index.html" + window.location.search));
}

function addLinksToShareButtons() {
	updateSocialText();
	d3.select(".ss-share-link.ico-embed")
		.on("click", toggleEmbedCode);
}

/* Check if URL parameters request logo removal, and remove them if they do
 */
function checkLogoRemoval() {
	if (QueryString.hasOwnProperty("logo")) {
		if (QueryString.logo == "none") {
			d3.select(".logos").selectAll("*").remove();
		}
	}
}

function checkSocialRemoval() {
	if (QueryString.hasOwnProperty("social")) {
		if (QueryString.social == "none") {
			d3.select(".social-share").selectAll("*").remove();
		}
	}
}

/* draw circle and 2 rectangles
 *
 * svg - svg object to draw person on
 * x, y - position of top left corner of person
 * height - in pixels of person.  width with padding will be half
 * class to apply to person (for CSS color styling)
 */
function drawPerson(svg, x, y, height, personClass) {
	var css_class;
	if (personClass) {
		css_class = "person " + personClass;
	} else {
		css_class = "person";
	}
	svg.append("circle")
		.attr("cx", x + 0.2*height)
		.attr("cy", y + 0.15*height)
		.attr("r", 0.15*height)
		.attr("class", css_class);

	svg.append("rect")
		.attr("x", x)
		.attr("y", y + 0.25*height)
		.attr("width", 0.4*height)
		.attr("height", 0.45*height)
		.attr("class", css_class);

	svg.append("rect")
		.attr("x", x + 0.1*height)
		.attr("y", y + 0.7*height)
		.attr("width", 0.2*height)
		.attr("height", 0.3*height)
		.attr("class", css_class);
}

function drawPeopleRow(numPeople, svg, x, y, height, personClass) {
	for (var i = 0; i < numPeople; i++) {
		drawPerson(svg, x + i*height/2, y, height, personClass);
	}
}

/* totalPeople is people to draw on this side
 * maxPeople is max people to draw on either side - we use it to set person
 * size so that both sides use the same size people
 */
function drawPeople(totalPeople, maxPeople, current_or_target) {
	var divSelector, personClass, rightAlign;
	if (current_or_target == "current") {
		divSelector = ".currently > .targets-people";
		personClass = "current";
		rightAlign = true;
	} else {
		divSelector = ".for-target > .targets-people";
		personClass = "target";
		rightAlign = false;
	}
	// TODO: deal with negative numbers - actually there are no negative
	// numbers in the dataset, though %age can be negative

	totalPeople = Math.round(totalPeople);
	maxPeople = Math.round(maxPeople);

	var personDiv = d3.select(divSelector);
	// remove everything inside the div
	personDiv.selectAll("*").remove();

	// add the graph
	var personDivInner = personDiv.append("div");
	var width = parseInt(personDivInner.style('width'));
	var height;
	if (maxPeople <= 10) {
		height = 0.25 * width;
	} else {
		height = 0.5 * width;
	}
	var personHeight = 0.2 * width;

	var vis = personDivInner.append("svg:svg")
		.attr("id", "country-targets-vis")
		.attr("width", width)
		.attr("height", height);

	// if totalPeople < 5 and maxPeople < 5, draw one row, full height
	// if totalPeople < 5 and maxPeople > 5, draw one row, half height
	// 5-10 we draw 1 rows, half height
	// 10-20 we draw 2 rows, half height
	// over 20 is an error
	var x = 0, y = 0;
	if (rightAlign) {
		// note maxPeople in first if, and totalPeople in 2nd if is deliberate
		// maxPeople controls person size, totalPeople controls number of rows
		if (totalPeople <= 10) {
			x = (10 - totalPeople) * (personHeight/2);
		} else {
			x = (20 - totalPeople) * (personHeight/2);
		}
	}

	if (totalPeople <= 10 ) {
		drawPeopleRow(totalPeople, vis, x, y, personHeight, personClass);
	} else if (totalPeople <= 20 ) {
		// for the 10 person row, x is always 0
		drawPeopleRow(10, vis, 0, y, personHeight, personClass);
		y = personHeight * 1.2;
		drawPeopleRow(totalPeople-10, vis, x, y, personHeight, personClass);
	} else {
		console.log("Can't draw more than 20 people");
	}
}

function updatePersonKey(peopleUnits) {
	var personHeight = config.personFullHeight;

	var width = personHeight;
	var height = personHeight;

	var personDiv = d3.select("#targets-key-person");
	// remove everything inside the div
	personDiv.selectAll("*").remove();
	var vis = personDiv.append("svg:svg")
		.attr("id", "country-targets-vis")
		.attr("width", width)
		.attr("height", height);

	drawPeopleRow(1, vis, 0, 0, personHeight, "key");

	var key_text = " = " + numberWithCommas(peopleUnits) + " " + getTranslation("people");
	d3.select("#targets-key-text").text(key_text);
}

function isDataForCountry(country_code) {
	if (allData.hasOwnProperty(country_code)) {
		if (allData[country_code].hasOwnProperty(selectedSource + "_initial") &&
		    allData[country_code].hasOwnProperty(selectedSource + "_increase")) {
			return true;
		}
	}
	return false;
}

function isTargetDataForCountry(country_code) {
	if (allData.hasOwnProperty(country_code)) {
		if (allData[country_code].hasOwnProperty(selectedSource + "_pop_current") &&
		    allData[country_code].hasOwnProperty(selectedSource + "_pop_universal")) {
			return true;
		}
	}
	return false;
}

function extraPercentToHitTarget(country_code) {
	if (isDataForCountry(country_code)) {
		var maxYearValue = valueForCountry(selectedCountry, config.maxYear);
		if (maxYearValue > 99.9) {
			return -1;
		}
		return (100 - maxYearValue) / (config.maxYear - config.thisYear);
	}
	return -1;
}

/* should we use k or m (thousands or millions)?
 * if both are under 1000000, use k
 * if both are over 1000000, use m
 * if max is over 1000000 and min is over 100000, use m
 * otherwise use k
 *
 * although if one is zero, just use the other number
 */
function selectTextUnits(number1, number2) {
	maxNumber = Math.max(Math.abs(number1), Math.abs(number2));
	minNumber = Math.min(Math.abs(number1), Math.abs(number2));

	var k = {number: 1000, abbrev: getTranslation("one_letter_1000")};
	var m = {number: 1000000, abbrev: getTranslation("one_letter_1000000")};

	if (minNumber === 0) {
		if (maxNumber < 1000000) {
			return k;
		} else {
			return m;
		}

	} else {
		if (maxNumber < 1000000) {
			return k;
		} else if (minNumber >= 100000) {
			return m;
		} else {
			return k;
		}
	}
}

/* converts number to numbers + m/k for million/thousand */
function numberAndUnitsToDigits(number, units) {
	number = number / units.number;

	if (number < 10) {
		return number.toFixed(1);
	} else {
		return Math.round(number);
	}
}

function selectPeopleUnits(number1, number2) {
	maxNumber = Math.max(Math.abs(number1), Math.abs(number2));
	if (maxNumber < 20000) { return 1000; }
	else if (maxNumber < 200000) { return 10000; }
	else if (maxNumber < 2000000) { return 100000; }
	else if (maxNumber < 20000000) { return 1000000; }
	else { return 10000000; }
}

function removeSelectedBorder() {
	// remove any old selected border
	d3.select(".selected-country-border").remove();
}

function updateSelectedBorder() {
	// remove any old selected border
	d3.select(".selected-country-border")
		.attr("class", "selected-country-border " + selectedSource);
}

function addBorderToSelectedCountry() {
	removeSelectedBorder();

	// add a border to just this country
	var selectedBorder = topojson.mesh(mapData, mapData.objects.subunits,
		function(a, b) { return (a.id == selectedCountry || b.id == selectedCountry); });
	mapsvg.append("path")
		.datum(selectedBorder)
		.attr("d", path)
		.attr("class", "selected-country-border " + selectedSource);
}

function countryClicked(d) {
	// don't select countries we don't have data for
	if (isDataForCountry(d.id)) {
		selectedCountry = d.id;
		updateSideBar();
		addBorderToSelectedCountry();

	}

}

function hoverCountry(d) {
	var coverage = valueForCountry(d.id, selectedYear);
	var minWidth = 6;
	var minHeight = 6;
	if (coverage !== null) {
		if(usePercentages)
		{
			coverage = formatPercent(Math.max(coverage,0)) + numberUnit;
		} else {
			coverage = formatNumber(Math.max(coverage,0)) + numberUnit;
		}	
	} else {
		coverage = "No Data";
		minWidth = 8;
	}
	var countryName = getCountryName(d.id);
	// set the width according to the length of the country name, but don't
	// get too small
	
	if(countryName === undefined){
		var ttWidth = minWidth;
		var ttHeight = minHeight;
	} else {
		var ttWidth = Math.max(minWidth, countryName.length*0.7);
		ttWidth = Math.max(ttWidth, numberUnit.length*0.5);
		var ttHeight = Math.max(minHeight, countryName.length * 0.2);
		ttHeight = Math.max(ttHeight, numberUnit.length*0.2);
	}
		
	d3.select(".tooltip-year").text(selectedYear.toString());
	d3.select(".tooltip-country").text(countryName);
	d3.select(".tooltip-percent").text(coverage);
	tooltipdiv.transition()
		.duration(200)
		.style("opacity", 0.9);
	var box = d3.select("#map")[0][0].getBoundingClientRect();
	
	tooltipdiv
		.style("width", ttWidth + "em")
		.style("height", ttHeight + "em")
		.style("left", (d3.event.pageX - box.left + 10) + "px")
		.style("top", (d3.event.pageY - box.top - 100) + "px")
}

function unhoverCountry(d) {
	tooltipdiv.transition()
		.duration(500)
		.style("opacity", 0);
}

function updateSliderYear() {
	d3.select("a.d3-slider-handle").text(selectedYear.toString());
}

function setCountryInfoYear() {
	d3.select(".country-info-year").text(selectedYear.toString());
}

function updateColorScale() {
	var colorRange;

	colorRange = config[selectedSource + "ColorRange"];
	// Update domains for absolute values
	colorDomain = config[selectedSource + "Domain"]; 
	extColorDomain = config[selectedSource + "ExtColorDomain"]; 
		
	colorScale = d3.scale.threshold()
		.domain(colorDomain)
		.range(colorRange);
}

function resetCountryIfNoData() {
	// the selected country might not have data for the other source
	if (valueForCountry(selectedCountry, selectedYear) === null) {
		selectedCountry = config.initialCountry;
		removeSelectedBorder();
	}
}

/* called by the slider */
function setYear(ext, value) {
	// Allow the slider to show more years than you can actually select
	// As in have the years 2000, 2005, 2010 all show on the axis, but
	// Even if you only have data from 2001 onwards
	if(value >= config.minYear && value <= config.maxYear){
		selectedYear = value;
		// update everything that varies by year
		updateSliderYear();
		setCountryInfoYear();
		drawLineGraphYearLine();
		setCountryInfoAccessText();
		updateMapColors();
	}
}

function setSource(source) {
	selectedSource = source;
	// Adjust domain based on used indicator
	activeDomain = config[selectedSource + "Domain"];
	activeExtColorDomain = config[selectedSource + "extColorDomain"];
	sourceName = source + "Unit";
	// infer usage of percentages from unit
	numberUnit = config[selectedSource + "Unit"];
	resetCountryIfNoData();
	// update everything that varies by source
	d3.select("#wrapperdiv").attr("class", "wrapper " + selectedSource);
	updateMapInfo();
	setCountryInfoAccessText();
	updateColorScale();
	updateLegend();
	updateMapColors();
	updateSideBar();
	updateSelectedBorder();
	updateSocialText();
}

function getCountryName(country_code) {
	if (allData.hasOwnProperty(country_code)) {
		return getTranslation(allData[country_code].name);
		return "test";
	}
	return "unknown";
}

function valueForCountry(country_code, year) {
	// Different approaches if displaying percentages or absolute values
	if(usePercentages){
		if (isDataForCountry(country_code)) {
			var initial = allData[country_code][selectedSource + "_initial"];
			var change = allData[country_code][selectedSource + "_increase"];
			var numYears = year - config.minYear;
			// don't return a value > 100 for percentages
			res = Math.min(100, initial + (numYears * change));
			// or less than 0%
			return Math.max(res, 0);
		}
	} else {
			if (isDataForCountry(country_code)) {
			var initial = allData[country_code][selectedSource + "_initial"];
			var change = allData[country_code][selectedSource + "_increase"];
			var numYears = year - config.minYear;
			// Special case for when projected indicator value goes below zero		
			// There should be no upper limit if it's not a percentage value
			res = Math.min(initial + (numYears * change), maxY);
			return Math.max(res, 0);
		}
		
	}
	// catch all exit
	return null;
}

function targetValueForCountry(country_code, year) {
	var highValueGood = false
	if (isDataForCountry(country_code) && year > config.thisYear) {
		// Needs to know whether a lower or a higher value is good 

	
		var initial = allData[country_code][selectedSource + "_initial"];
		var increase = allData[country_code][selectedSource + "_increase"];
		if (usePercentages)
		{
			var thisYearValue = Math.min(100,
				initial + (increase * (config.thisYear - config.minYear)));
			var targetIncrease = (100 - thisYearValue) / (config.maxYear - config.thisYear);
		} else {
			var thisYearValue = initial + (increase * (config.thisYear - config.minYear));
			if(highValueGood)
			{
				var targetIncrease = (maxY - thisYearValue) / (config.maxYear - config.thisYear);
			} else {
				var targetIncrease = 0;
				return 0
			}
		}
		return thisYearValue + (targetIncrease * (year - config.thisYear));
	}
	// catch all exit
	return null;
}

/* finds the year when the percent = 100 */
function findYear100(country_code) {
	if (isDataForCountry(country_code)) {
		var initial = allData[country_code][selectedSource + "_initial"];
		var increase = allData[country_code][selectedSource + "_increase"];
		if (increase <= 0) {
			return null;
		}
		if(usePercentages){
			// min year e.g. 2001 + an amount of years where the line intersects 100
			return Math.round((100 - initial) / increase) + config.minYear;
		} else {
			// What happens when we are not using percentages? 
			return 0;
			//return Math.round((maxY - initial) / increase) + config.minYear; // HUOM
		}
	}
	return null;
}

function findYearMax(country_code) {
	if (isDataForCountry(country_code)) {
		var initial = allData[country_code][selectedSource + "_initial"];
		var increase = allData[country_code][selectedSource + "_increase"];
		if (increase <= 0) {
			return null;
		}
		if(usePercentages){
			// min year e.g. 2001 + an amount of years where the line intersects 100
			return Math.round((maxY - initial) / increase) + config.minYear;
		} else {
			// What happens when we are not using percentages? 
			return Math.abs(Math.round((0-initial) / increase)) + config.minYear;
			//return Math.round((maxY - initial) / increase) + config.minYear; // HUOM
		}
	}
	return null;
}

/* finds the year when the value = 0 */
function findYear0(country_code) {
	if (isDataForCountry(country_code)) {
		var initial = allData[country_code][selectedSource + "_initial"];
		var increase = allData[country_code][selectedSource + "_increase"];
		if (increase <= 0) {
			// return the year when the line crosses 0
			var res = Math.round((0-initial) / increase) + config.minYear; 
			
			return Math.max(res, 0);		
		}
		if(usePercentages){
			return Math.max(Math.round((initial) / increase) + config.maxYear, 0);
		} else {
			return Math.max(Math.round((0-initial) / increase) + config.minYear, 0);
		}
	}
	return null;
}


function extractDataForSourceAndYear() {
	// selectedSource
	var yearData = {};
	// cycle through the countries
	for (var country_code in allData) {
		if (allData.hasOwnProperty(country_code)) {
			var value = valueForCountry(country_code, selectedYear);
			if (value !== null) {
				yearData[country_code] = value;
			}
		}
	}
	return yearData;
}

function updateLegend() {
	// remove the old legend, if any
	var legendDiv = d3.select("#map-legend-svg");
	legendDiv.selectAll("*").remove();

	var lenScale = extColorDomain.length;
	// subtract lenScale for 1 px separator between boxes
	// subtract 20 to allow for 10px margin either side
	// divide by lenScale for size of each
	var legendWidth = parseInt(legendDiv.style('width'));
	var ls_w = Math.floor((legendWidth - lenScale) / lenScale);
	var ls_h = ls_w;
	var legend_width = (ls_w + 1) * (lenScale + 1);

	// create the new legend
	var legendSvg = legendDiv.append("svg")
		.attr("width", legend_width)
		.attr("height", ls_h)
		.style("margin", "auto");

	var legend = legendSvg.selectAll("g.legend")
		.data(extColorDomain)
		.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", function(d, i) { return (ls_w + 1) * i; })
		.attr("y", 0)
		.attr("width", ls_w)
		.attr("height", ls_h)
		.style("fill", function(d, i) { return colorScale(d); })
		.style("opacity", 0.8);
	
	if(usePercentages)
	{
		d3.select("#lowerBound")
			.text("0%");
		d3.select("#upperBound")
			.text("100%");
	} else {
		// Pick bounds from domain array
		d3.select("#lowerBound")
			.text(activeDomain[0].toString());
		d3.select("#upperBound")
			.text(activeDomain[activeDomain.length-1].toString() + "+");				
	}
	
	if (selectedSource == 'indicator1') {
		title = getTranslation("access to indicator1");
	} else if (selectedSource == 'indicator2') {
		title = getTranslation("access to indicator2");
	} else if (selectedSource == 'indicator3') {
		title = getTranslation("access to indicator3");
	}
	d3.select("#map-legend-label")
		.text(title);
}

/*
 * set the text in the main title and update the buttons
 */
function updateMapInfo() {
	var extraSpace; // whether to leave blank space under the title
	if (selectedSource == "indicator1") {
		d3.select("#select-indicator1-source").attr("class", "button source current-source");
		d3.select("#select-indicator2-source").attr("class", "button source");
		d3.select("#select-indicator3-source").attr("class", "button source");
		extraSpace = "<br />&nbsp";
	} else if (selectedSource == "indicator2") {
		d3.select("#select-indicator1-source").attr("class", "button source");
		d3.select("#select-indicator2-source").attr("class", "button source current-source");
		d3.select("#select-indicator3-source").attr("class", "button source");
		extraSpace = "<br />&nbsp";
	} else if (selectedSource == "indicator3") {
		d3.select("#select-indicator1-source").attr("class", "button source");
		d3.select("#select-indicator2-source").attr("class", "button source");
		d3.select("#select-indicator3-source").attr("class", "button source current-source");
		extraSpace = "<br />&nbsp";
	}
	
	// If the unit contains percentages, then use percentage logic
	if(config[selectedSource + "Unit"].search("%") == -1 && config[selectedSource + "Unit"].search("percent") == -1)
	{
		usePercentages = false;
		// Set the scale of the y-axis for the graph in the info bar
		maxY = config[selectedSource + "Domain"][config[(selectedSource + "Domain")].length-1];
	} else {
		usePercentages = true;
		maxY = 100;
	}

	d3.select(".map-info > h1 > span.big")
		.attr("class", "big " + selectedSource)
		.text(getTranslation(selectedSource))
		.append("strong").text(" " + config.minYear.toString() + "-" +
			config.maxYear.toString())
		.append("span").html(extraSpace);
}

function setCountryInfoAccessText() {
	var accessText, accessTextPast, accessTextFuture;
	if(usePercentages){
		var value = formatPercent(valueForCountry(selectedCountry, selectedYear));
	} else {
		var value = formatNumber(valueForCountry(selectedCountry, selectedYear));
	}
		
	if (selectedSource == 'indicator1') {
		accessTextPast = getTranslation('of people have access to water - past');
		accessTextFuture = getTranslation('of people have access to water - future');
		targetText = getTranslation('of people need access to water');
	} else if (selectedSource == 'indicator2') {
		accessTextPast = getTranslation('of people have access to sanitation - past');
		accessTextFuture = getTranslation('of people have access to sanitation - future');
		targetText = getTranslation('of people need access to sanitation');
	} else {
		accessTextPast = getTranslation('of people have access to indicator3 - past');
		accessTextFuture = getTranslation('of people have access to indicator3 - future');
		targetText = getTranslation('of people need access to indicator3');
	}
	if (selectedYear <= config.thisYear) {
		accessText = accessTextPast;
	} else {
		accessText = accessTextFuture;
	}
	var accessTextElement = d3.select("#country-info-access-text");
	accessTextElement.selectAll("*").remove();
	var percentSpan = accessTextElement.append("span")
		.attr("class", "access-percentage")
		.text(value);
	if(usePercentages)
	{
	percentSpan.append("span")
		.attr("class", "percent-sign")
		.text(numberUnit);
	}
	accessTextElement.append("span").text(" " + accessText + " ");
	accessTextElement.append("span")
		.attr("class", "in-year")
		.text("in " + selectedYear.toString());
	
	if (selectedYear > config.thisYear) {
		accessTextElement.append("span")
			.attr("class", "actual-projected")
			.text(" " + getTranslation("current trends"));
	}
	
	endTrendValue = valueForCountry(selectedCountry, config.maxYear);
	
	if(usePercentages){
		
	} else { 
		if (selectedYear > config.thisYear && endTrendValue < 100) {
			targetValue = formatPercent(targetValueForCountry(selectedCountry, selectedYear));
			targetTextElement = accessTextElement.append("p")
				.attr("class", "target-increase");
			percentSpan = accessTextElement.append("span")
				.attr("class", "target-percentage")
				.text(targetValue);
			percentSpan.append("span")
				.attr("class", "percent-sign")
				.text(numberUnit);
			accessTextElement.append("span").text(" " + targetText + " ");
			accessTextElement.append("span")
				.attr("class", "in-year")
				.text("in " + selectedYear.toString());
			accessTextElement.append("span")
				.attr("class", "achieve-targets")
				.text(" " + getTranslation("to achieve targets"));
		}
	}
	
	
}

function drawLineGraphYearLine() {
	// Adjust line based on type of data
	d3.select(".year-line").remove();
	graphsvg.append("svg:line")
		.attr("class", "year-line")
		.attr("x1", lgX(selectedYear))
		.attr("y1", -1 * lgY(0))
		.attr("x2", lgX(selectedYear))
		.attr("y2", -1 * lgY(maxY+1));

}

function plotAllYearData() {
	var countryInfo = d3.select("#country-info");
	// remove everything inside the country-info div
	countryInfo.selectAll("*").remove();
	// put title stuff in
	countryInfo.append("div")
		.attr("class", "country-info-year")
		.text(selectedYear.toString());
	countryInfo.append("h2")
		.text(getCountryName(selectedCountry));
	countryInfo.append("p")
		.attr("id", "country-info-access-text");
	setCountryInfoAccessText();
	
	// Find out whether a good outcome is a high value (e.g. 100%) or a low value (e.g. 0 open defecations per square km)
	var optimalValue = config[selectedSource + "OptimalValue"];

	// add the graph div
	//var visDivInstruction = countryInfo.append("div")
	//	.attr("id", "country-info-advice")
	//	.text("Please click on a state to display data");
	
	var visDiv = countryInfo.append("div")
		.attr("id", "country-info-graph");
		
	var visDivSource = countryInfo.append("div")
		.attr("id", "country-info-source")
		.text("Source: ")
		.append("a")
		.attr("href", "http://censusindia.gov.in")
		.html("2001 census and 2011 census");
		
	var visDivLegend = visDiv.append("div")
	//	.attr("class", "graphLegend");
		.attr("id", "graphL");
	var visDivInner = visDiv.append("div")
		.attr("class", "inner");

		
	var legendImage = document.createElement("img");
	legendImage.setAttribute("src", "images/legend.png");
	document.getElementById("graphL").appendChild(legendImage);
		
	// dimensions of line graph
	var width = parseInt(visDivInner.style('width'));
	// Different dimensions depending on if using percentages or not
	if(maxY < 110) 
	{
		var height = config.lineGraphAspectRatio * width;
	} else { 
		var height = maxY * config.lineGraphAspectRatio;
	}
	
	var margin = {left: 40, right: 15, top: 6, bottom: 20};
	lgY = d3.scale.linear()
		.domain([0, maxY])
		.range([0 + margin.bottom, height - margin.top]);
	lgX = d3.scale.linear()
		.domain([config.minYear, config.maxYear])
		.range([0 + margin.left, width - margin.right]);

	// add the graph svg
	var vis = visDivInner.append("svg:svg")
		.attr("width", width)
		.attr("height", height);

	graphsvg = vis.append("svg:g")
		.attr("transform", "translate(0, " + height.toString() + ")");

	var minYearValue = valueForCountry(selectedCountry, config.minYear);
	var thisYearValue = valueForCountry(selectedCountry, config.thisYear);
	var maxYearValue = valueForCountry(selectedCountry, config.maxYear);
	var limitYearValue;
	var hitLimit = false;
	
	if(thisYearValue < 0)
	{
		thisYearValue = 0;
	}
	
	// the graph lines
	// From the start of recorded time till the current year
	graphsvg.append("svg:line")
		.attr("class", "history")
		.attr("x1", lgX(config.minYear))
		.attr("y1", -1 * lgY(minYearValue))
		.attr("x2", lgX(config.thisYear))
		.attr("y2", -1 * lgY(thisYearValue));
	
	// Projection line
	
	if (maxYearValue >= maxY) {
		hitLimit = true;
		// handle the case where we hit the maximum Y before maxYear
		var yearMax = findYearMax(selectedCountry); // When the indicator value for the selected area exceeds the upper bound
		graphsvg.append("svg:line")
			.attr("class", "projection")
			.style("stroke-dasharray", ("3, 3"))
			.attr("x1", lgX(config.thisYear))
			.attr("y1", -1 * lgY(thisYearValue))
			.attr("x2", lgX(yearMax))
			.attr("y2", -1 * lgY(maxY));
		
		// Straight line at the upper limit
		graphsvg.append("svg:line")
			.attr("class", "projection")
			.style("stroke-dasharray", ("3, 3"))
			.attr("x1", lgX(yearMax))
			.attr("y1", -1 * lgY(maxY))
			.attr("x2", lgX(config.maxYear))
			.attr("y2", -1 * lgY(maxY));

		} else if (maxYearValue <= 0) {
		hitLimit = true;
		var yearMin = findYear0(selectedCountry);
			
		// Hitting the lower bound before the end year
		graphsvg.append("svg:line")
			.attr("class", "projection")
			.style("stroke-dasharray", ("3, 3"))
			.attr("x1", lgX(config.thisYear))
			.attr("y1", -1 * lgY(thisYearValue))
			.attr("x2", lgX(yearMin))
			.attr("y2", -1 * lgY(0));
			
		// Straight line at the lower limit
		graphsvg.append("svg:line")
			.attr("class", "projection")
			.style("stroke-dasharray", ("3, 3"))
			.attr("x1", lgX(yearMin))
			.attr("y1", -1 * lgY(0))
			.attr("x2", lgX(config.maxYear))
			.attr("y2", -1 * lgY(0));
			
		} else {
			// The projection line hits neither the top nor bottom bound
			graphsvg.append("svg:line")
				.attr("class", "projection")
				.style("stroke-dasharray", ("3, 3"))
				.attr("x1", lgX(config.thisYear))
				.attr("y1", -1 * lgY(thisYearValue))
				.attr("x2", lgX(config.maxYear))
				.attr("y2", -1 * lgY(maxYearValue));
		}
		
	// Projection towards a target 1
	// Don't project if target already reached
	// What about if the opposite limit has already been reached? Then there still should be a projection line to the intended target
	if(!hitLimit){
		if(optimalValue == "low"){
		// Project downwards if low values are good
		 // Projecting to max year
		 graphsvg.append("svg:line")
			.attr("class", "universal")
			.attr("x1", lgX(config.thisYear))
			.attr("y1", -1 * lgY(thisYearValue))
			.attr("x2", lgX(config.maxYear))
			.attr("y2", -1 * lgY(0));
			
		// Projecting to second target year
		graphsvg.append("svg:line")
			.attr("class", "government")
			.attr("x1", lgX(config.thisYear))
			.attr("y1", -1 * lgY(thisYearValue))
			.attr("x2", lgX(config.targetYear2))
			.attr("y2", -1 * lgY(0));
		
		} else if (optimalValue == "high") {
		// Project upwards if high values are good
		 graphsvg.append("svg:line")
			.attr("class", "universal")
			.attr("x1", lgX(config.thisYear))
			.attr("y1", -1 * lgY(thisYearValue))
			.attr("x2", lgX(config.maxYear))
			.attr("y2", -1 * lgY(maxY));	
		
		// Projecting to second target year
		graphsvg.append("svg:line")
			.attr("class", "government")
			.attr("x1", lgX(config.thisYear))
			.attr("y1", -1 * lgY(thisYearValue))
			.attr("x2", lgX(config.targetYear2))
			.attr("y2", -1 * lgY(maxY));
		}
	}		
	// the axes
	graphsvg.append("svg:line")
		.attr("class", "axis")
		.attr("x1", lgX(config.minYear))
		.attr("y1", -1 * lgY(0))
		.attr("x2", lgX(config.maxYear))
		.attr("y2", -1 * lgY(0));
		
	graphsvg.append("svg:line")
		.attr("class", "axis")
		.attr("x1", lgX(config.minYear))
		.attr("y1", -1 * lgY(0))
		.attr("x2", lgX(config.minYear))
		.attr("y2", -1 * lgY(maxY));

	// the ticks on the axes 
	graphsvg.selectAll(".xLabel")
		.data(config.yearsOnGraph)
		.enter().append("svg:text")
		.attr("class", "xLabel")
		.text(String)
		.attr("x", function(d) { return lgX(d); })
		.attr("y", 0)
		.attr("text-anchor", "middle");
	graphsvg.selectAll(".yLabel")
		.data(lgY.ticks(5))
		.enter().append("svg:text")
		.attr("class", "yLabel")
		.text(String)
		.attr("x", 0)
		.attr("y", function(d) { return -1 * lgY(d); })
		.attr("text-anchor", "right")
		.attr("dy",  4);

	graphsvg.selectAll(".xTicks")
		.data(config.yearsOnGraph)
		.enter().append("svg:line")
		.attr("class", "xTicks")
		.attr("x1", function(d) { return lgX(d); })
		.attr("y1", -1 * lgY(0))
		.attr("x2", function(d) { return lgX(d); })
		.attr("y2", -1 * lgY(-5));
	
	graphsvg.selectAll(".yTicks")
		.data(lgY.ticks(5))
		.enter().append("svg:line")
		.attr("class", "yTicks")
		.attr("x1", lgX(config.minYear))
		.attr("y1", function(d) { return -1 * lgY(d); })
		.attr("x2", lgX(config.minYear-1))
		.attr("y2", function(d) { return -1 * lgY(d); });

	// finally add the year line
	drawLineGraphYearLine();
}

/* update the targets
 *
 * We need to update both the numbers, units (k/m) and the set of people
 * representing the numbers
 */
function updateTargetPanel() {


/* Disabling for India map

	if (isTargetDataForCountry(selectedCountry)) {
		var popCurrent = 1000 * allData[selectedCountry][selectedSource + "_pop_current"];
		var popUniversal = 1000 * allData[selectedCountry][selectedSource + "_pop_universal"] - popCurrent;
		// popUniversal is relative, but don't allow popUniversal to be negative
		if (popUniversal < 10) { popUniversal = 0; }

		var units = selectTextUnits(popCurrent, popUniversal);
		var digitsCurrent = numberAndUnitsToDigits(popCurrent, units);
		var digitsUniversal = numberAndUnitsToDigits(popUniversal, units);

		d3.select(".currently .targets-number-digits").text(digitsCurrent);
		d3.select(".currently .targets-number-unit").text(units.abbrev);

		if (popUniversal > 0) {
			d3.select(".for-target .targets-number-digits").text(digitsUniversal);
			d3.select(".for-target .targets-number-unit").text(units.abbrev);
		} else {
			d3.select(".for-target .targets-number-digits").text("0");
			d3.select(".for-target .targets-number-unit").text("");
		}

		if(usePercentages)
		{		
			// now do the extra percent bit
			var extraPercent = extraPercentToHitTarget(selectedCountry);
			if (extraPercent > 0) {
				d3.select(".targets-percent").style("visibility", "visible");
				d3.select(".targets-percent-digits").text(extraPercent.toFixed(1));
			} else {
				d3.select(".targets-percent").style("visibility", "hidden");
			}
		} else {
		
		}

		// now do the people
		var peopleUnits = selectPeopleUnits(popCurrent, popUniversal);
		var numPeopleCurrent = popCurrent/peopleUnits;
		var numPeopleUniversal = popUniversal/peopleUnits;
		var maxPeople = Math.max(numPeopleCurrent, numPeopleUniversal);
		drawPeople(numPeopleCurrent, maxPeople, "current");
		drawPeople(numPeopleUniversal, maxPeople, "target");
		updatePersonKey(peopleUnits);
		d3.select(".targets-key").style("visibility", "visible");

		// finally update the text
		if (selectedSource == "indicator1") {
			d3.select(".targets-subtitle")
				.text(getTranslation("Total number of new people gaining access to water"));
			d3.select(".currently > .targets-detail")
				.text(getTranslation("more people per year will gain access to water"));
		} else if (selectedSource == "indicator2"){
			d3.select(".targets-subtitle")
				.text(getTranslation("Total number of new people gaining access to sanitation"));
			d3.select(".currently > .targets-detail")
				.text(getTranslation("more people per year will gain access to sanitation"));
		}
	} else {
		// no data, so clear the panel
		d3.select(".currently .targets-number-digits").text("");
		d3.select(".currently .targets-number-unit").text("no data");
		d3.select(".for-target .targets-number-digits").text("");
		d3.select(".for-target .targets-number-unit").text("no data");
		d3.select(".targets-percent").style("visibility", "hidden");
		drawPeople(0, 0, "current");
		drawPeople(0, 0, "target");
		d3.select(".targets-key").style("visibility", "hidden");
	}
	
*/
}

function indianNumbers(nStr){

	if (nStr<1000){
		return nStr;
	}

	var FullData = format( "#,##0.####", nStr);
	var n = FullData.split(",");
	var part1 = "";
	for(i=0;i<n.length-1;i++)
		part1 +=n[i];
	var part2 = n[n.length-1];
	return (format( "##,##.####", part1) + "," + part2);

}

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function updateDataTable() {

	var decimals = 0;
	//d3.selectAll("#r4c2")
	//	.text(allData[selectedCountry]["required_complexes"]);
	// First Column
	d3.selectAll("#r2c2")
		.text(addCommas((allData[selectedCountry]["% of schools without toilet facilities"]).toFixed(decimals))+ "%");
	d3.selectAll("#r3c2")
		.text(addCommas((allData[selectedCountry]["Anganwadi - % of (No Suggestions) without toilet facilities"]).toFixed(decimals)) + "%");
	d3.selectAll("#r1c2")
		.text(addCommas(100-(allData[selectedCountry]["IHHL - Access to a IHHL latrine (rural only as per the baseline, APL&BPL)"]).toFixed(decimals)) + "%");
		
	// Second column
	d3.selectAll("#r1c3")
		.text(indianNumbers(addCommas((allData[selectedCountry]["IHHL - latrines to be constructed under SBA (only those eligible) i.e SBA target"]).toFixed(decimals))));		
	d3.selectAll("#r2c3")
		.text(indianNumbers(addCommas((allData[selectedCountry]["School - Without Toilet"]).toFixed(decimals))));			
	d3.selectAll("#r3c3")
		.text(indianNumbers(addCommas((allData[selectedCountry]["Anganwadi - Without Latrines"]).toFixed(decimals))));		
	d3.selectAll("#r4c3")
		.text(indianNumbers(addCommas((allData[selectedCountry]["CSC - Required Complexes"]).toFixed(decimals))));
				
	// Third column
	d3.selectAll("#r1c4")
		.text(indianNumbers(addCommas((allData[selectedCountry]["IHHL - Cost of meeting SBA target for IHHL -Lakh Rs"]).toFixed(decimals))));
	d3.selectAll("#r2c4")
		.text(indianNumbers(addCommas((allData[selectedCountry]["School - Subsidy for government schools@35000 per unit -Lakh Rs"]).toFixed(decimals))));
	d3.selectAll("#r3c4")
		.text(indianNumbers(addCommas((allData[selectedCountry]["Anganwadi - Subsidy for Aaganwadi toilets@8000 per unit - Lakh Rs"]).toFixed(decimals))));
	d3.selectAll("#r4c4")
		.text(indianNumbers(addCommas((allData[selectedCountry]["CSC - Subsidy for Sanitary Complex@200000 per unit - Lakh  Rs"]).toFixed(decimals))));
		
		
	d3.selectAll("#r5c4")
		.text(indianNumbers(addCommas((allData[selectedCountry]["Total cost of SBA of SBA targets (IHHL,school, Anganwadi and CSC) - Lakh Rs"]).toFixed(decimals))));
	return 0
			
}

function updateSideBar() {
	plotAllYearData();
	updateTargetPanel();
	updateDataTable();
}

function colorScaleOrDefault(data, id) {
	if (data.hasOwnProperty(id)) {
		return colorScale(data[id]);
	} else {
		return config.noDataColor;
	}
}

function updateMapColors() {
	var yearData = extractDataForSourceAndYear();
	mapsvg.selectAll(".country")
		.style("fill", function(d) {
			return colorScaleOrDefault(yearData, d.id);
		});
}

function createSlider() {
	d3.select('#year-slider').selectAll("*").remove();
	mapSlider = d3.select('#year-slider').call(
		d3.slider()
			.axis(true)
			.min(Math.min(2000, config.minYear)) // At least 2000 so that the axis shows
			.max(config.maxYear)
			.step(1)
			.value(selectedYear)
			.on("slide", setYear));
	updateSliderYear();
}

function loadedDataCallback(error, africa, dataset, langData) {
	allData = dataset;
	mapData = africa;
	translations = langData;
	updateStaticText();

	var countries = topojson.feature(africa, africa.objects.subunits).features;
	var borders = topojson.mesh(africa, africa.objects.subunits,
		function(a, b) { return true; });

	updateColorScale();

	mapsvg.selectAll(".subunit")
		.data(countries)
		.enter()
			.append("path")
			.attr("d", path)
			.attr("class", function(d) { return "country " + d.id; })
			.on("click", countryClicked)
			.on("mouseover", hoverCountry)
			.on("mouseout", unhoverCountry);

	updateMapColors();

	mapsvg.append("path")
		.datum(borders)
		.attr("d", path)
		.attr("class", "country-border");

	updateLegend();
	updateSideBar();
	createSlider();

	addLinksToShareButtons();

	checkLogoRemoval();
	checkSocialRemoval();

	// causes trouble for IE 9 - so do it last
	tooltipdiv.style("opacity", 0);
}

function setDefaultSelections() {
	selectedCountry = config.initialCountry;
	selectedYear = config.thisYear;
	usePercentages = config.usePercentages;
	numberUnit = config[selectedSource + "Unit"];
	domainArray = config[selectedSource + "Domain"];
	maxY = domainArray[domainArray.length - 1];
	optimalValue = config[selectedSource + "OptimalValue"];
}


function init(mapconfig) {

	config = mapconfig;

	var mapurl, dataurl;
	level = "states"; // default
	// Set level of the map (state or district) based on url
	var url = window.location.href;
	if(url.search("level") == -1)
	{
		url += "?level=" + level;
		window.location.href = url;
	}
	// override
	if (QueryString.hasOwnProperty("level")) {
		level = QueryString.level.replace("/","");
	}

	if(level == 'states') {
		mapurl = config.mapurl_topojson_states;
		dataurl = config.dataurl_states;
	} else if (level == 'districts') {
		mapurl = config.mapurl_topojson_districts;
		dataurl = config.dataurl_districts;
	}
	// check for svg support
	if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) {
		replaceBodyWithFallbackImage();
		return;
	}
	// we don't want to reset source on reset button
	selectedSource = config.initialSource;
	if (QueryString.hasOwnProperty("source")) {
		selectedSource = QueryString.source;
	}
	
	// Set these depending the indicator, i.e. do we have a percentage indicator or some absolute values
	colorDomain = config[selectedSource + "Domain"];
	extColorDomain = config[selectedSource + "ExtColorDomain"]; 
	activeDomain = colorDomain;
	activeExtColorDomain = extColorDomain;

	setDefaultSelections();

	var width = parseInt(d3.select('#map').style('width'));
	// Ratio looks to adjust where footer falls too
	var mapRatio = 1;
	var height = width * mapRatio;

	// Default language
	var lang = "en";
	// Overrides language settings from the url
	if (QueryString.hasOwnProperty("lang")) {
		lang = QueryString.lang;
	}
	
	var lang_url = 'data/lang_' + lang + '.json';

	// Adjust the translation of the projection to ensure that the clicking and hovering functionality remains
	var projection = d3.geo.mercator()
		.scale(width*1.75)
		.translate([-width - 780, height/2+540]);
	path = d3.geo.path().projection(projection);

	d3.select("#select-indicator1-source")
		.on("click", function(d) { setSource("indicator1"); });
	d3.select("#select-indicator2-source")
		.on("click", function(d) { setSource("indicator2"); });
	d3.select("#select-indicator3-source")
		.on("click", function(d) { setSource("indicator3"); });	
		
	d3.select("#reset-button").on("click", reset);
	d3.select("#level-button").on("click", switchLevel);
	
	mapsvg = d3.select("#map").insert("svg", "div.tooltip")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "map-svg");
		
	tooltipdiv = d3.select("#map > .tooltip");
	
	// Change text under graph
	if (QueryString.hasOwnProperty("level")) {
		lvl = QueryString.level;
	}
	
	if (lvl == "districts/")
	{
		lvl = "district";
	} else if (lvl == "states/") {
		lvl = "state";
	}

	d3.selectAll("#country-info-advice")
		.text("Please click on a " + lvl + " to display data");
		
	
	queue()
		.defer(d3.json, mapurl)
		.defer(d3.json, dataurl)
		.defer(d3.json, lang_url)
		.await(loadedDataCallback);
}

function replaceUrlParam(url, paramName, paramValue){
   var pattern = new RegExp('('+paramName+'=).*?(&|$)') 
   var newUrl = url.replace(pattern,'$1' + paramValue + '$2');
   if(newUrl == url){
       newUrl = newUrl + (newUrl.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue 
   }
   return newUrl
}

function switchLevel() {
	// Switch between district and state maps based on url parameter
	if (level == "districts"){		

		// Change data source and reload page
		window.location.href = replaceUrlParam(window.location.href, "level", "states");
	} else if (level == "states") {

		// Change data source and reload page
		window.location.href = replaceUrlParam(window.location.href, "level", "districts");
	} 


	
}

function reset() {
	// Currently resetting by refreshing the whole page
	location.reload();
	
	/*selectedYear = config.minYear;
	selectedCountry = config.initialCountry;
	setDefaultSelections();	// update everything that varies by source, year and country
	createSlider();
	setCountryInfoAccessText();
	updateColorScale();
	updateLegend();
	updateMapColors();
	updateSideBar();
	removeSelectedBorder();*/
}
return {init: init};
})();