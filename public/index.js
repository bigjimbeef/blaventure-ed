


$(document).ready(function() {
	console.log("sup");

	main();

	$('svg').svgPan('viewport', {
		minZoom: 0.5,
		maxZoom: 3,
		panButton: 1
	});
});

MAP_SIZE 	= 100;
TILE_SIZE	= 40;

function checkForExistingPath(nearest, deleteIfFound) {

	deleteIfFound 	= deleteIfFound != undefined ? deleteIfFound : false;
	var match 		= -1;

	for ( var i = 0; i < path.length; ++i ) {

		var item = path[i];

		if ( item.x == nearest.x && item.y == nearest.y ) {
			
			match = i;
			break;
		}
	}

	if ( deleteIfFound && match > -1 ) {

		path.splice(match, 1);
	}

	return match != -1;
}

function drawBoxAtNearest(nearest, viewport) {

	if ( checkForExistingPath(nearest) ) {
		return;
	}

	viewport.append("rect")
		.attr("x", nearest.x)
		.attr("y", nearest.y)
		.attr("width", TILE_SIZE)
		.attr("height", TILE_SIZE)
		.attr("fill", Please.make_color())
		.attr("class", "pathable");

	path.push({
		x: nearest.x, 
		y: nearest.y
	});
}

function getNearestTile(mouseX, mouseY) {

	var viewport		= d3.select('#viewport');
	var viewportXForm	= viewport.attr("transform");

	var viewportTranslate = {
		x: d3.transform(viewportXForm).translate[0],
		y: d3.transform(viewportXForm).translate[1]
		};

	var viewportScale = {
		x: d3.transform(viewportXForm).scale[0],
		y: d3.transform(viewportXForm).scale[1]
	};

	var currentX	= viewportTranslate.x;
	var currentY	= viewportTranslate.y;

	var targetX		= ( mouseX - currentX ) / viewportScale.x;
	var targetY		= ( mouseY - currentY ) / viewportScale.y;
	var closestX 	= Math.floor(targetX / TILE_SIZE) * TILE_SIZE;
	var closestY 	= Math.floor(targetY / TILE_SIZE) * TILE_SIZE;

	return {
		x: closestX,
		y: closestY
	};
}

var paintState = null;
var path = [];

function paintOrRemove(evt) {

	var nearest = getNearestTile(evt.clientX, evt.clientY);

	if ( paintState == PAINTING ) {
		
		drawBoxAtNearest(nearest, d3.select('#viewport'));
	}
	else if ( paintState == REMOVING ) {

		var targetEl = evt.toElement || evt.target;

		if ( $(targetEl).get(0).classList.contains("pathable") ) {
			
			checkForExistingPath(nearest, true);

			$(evt.toElement).remove();
		}
	}
}

function main() {

	DRAW_BUTTON = 0;

	PAINTING = "painting";
	REMOVING = "removing";

	$(document).on("dragstart", function() {
    	return false;
	});

	$('svg').mousedown(function(evt) {

		if ( evt.button != DRAW_BUTTON ) {
			return false;
		}

		// Determine if we're removing, or painting.
		paintState = PAINTING;

		var targetEl = evt.toElement || evt.target;

		if ( $(targetEl).get(0).classList.contains("pathable") ) {
			
			paintState = REMOVING;
		}

		paintOrRemove(evt);
	});

	$('svg').mousemove(function(evt) {
		
		// No buttons held down, or the wrong button.
		if ( evt.buttons == 0 || ( evt.buttons > 0 && evt.button != DRAW_BUTTON ) ) {
			return;
		}

		paintOrRemove(evt);
	});
}