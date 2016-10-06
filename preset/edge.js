registry.normalline = {
	drawEdge: (element, system, canvas, context, e, s, d, ed) => {
		context.strokeStyle = getAttribute(element, ed, "color");
		context.lineWidth = getAttribute(element, ed, "lineWidth", 1);

		context.beginPath();
		context.moveTo(s.x, s.y);
		context.lineTo(d.x, d.y);
		context.stroke();
	}
};
