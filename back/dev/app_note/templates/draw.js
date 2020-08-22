var path;
// The distance between the points:
function onMouseDown(event) {
	if (path) {
		path.selected = false;
	}
    path = new Path({
		segments: [event.point],
		strokeColor: 'black',
        opacity: 0.5,
        strokeWidth: 5,
        strokeCap: 'round',
		// Select the path, so we can see its segment points:
		//fullySelected: true
	});
}
function onMouseDrag(event) {
	path.add(event.point);
}

// When the mouse is released, we simplify the path:
function onMouseUp(event) {
	var segmentCount = path.segments.length;
	path.simplify(5);
	path.fullySelected = true;
}

function onKeyDown(event) {
	if(event.key == 'z') {
		path.remove();
	}
}
