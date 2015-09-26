


$(document).ready(function() {
	console.log("sup");

	main();

	$('svg').svgPan('viewport', {
		minZoom: 0.5,
		maxZoom: 3,
	});
});



GRID_SIZE = 40;

function markLocation(targetX, targetY, viewport) {

	// We find the closest matching grid square to that target X and Y
	var closestX = Math.floor(targetX / GRID_SIZE) * GRID_SIZE;
	var closestY = Math.floor(targetY / GRID_SIZE) * GRID_SIZE;

	viewport.append("rect")
		.attr("x", closestX)
		.attr("y", closestY)
		.attr("width", GRID_SIZE)
		.attr("height", GRID_SIZE)
		.attr("fill", "red");

	
}

function main() {

	$('svg').click(function(evt) {

		// Only draw on left-click
		if ( evt.button > 0 ) {
			return false;
		}

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

		console.log(evt.clientX, evt.clientY);
		console.log(viewportTranslate, viewportScale);

		var targetX		= ( evt.clientX - currentX ) / viewportScale.x;
		var targetY		= ( evt.clientY - currentY ) / viewportScale.y;

		markLocation(targetX, targetY, viewport);
	});

}