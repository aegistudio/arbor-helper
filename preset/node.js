registry.expand = {
	drawNode: (element, system, canvas, context, e, center, d) => {
		d.maxWidth = getAttribute(element, d, "width")
		d.maxHeight = getAttribute(element, d, "height");
	}
};

registry.background = {
	drawNode: (element, system, canvas, context, e, center, d) => {
		var width = d.maxWidth;		var height = d.maxHeight;

		context.fillStyle = getAttribute(element, d, "color");
		context.fillRect(center.x - width / 2, center.y - height / 2, width, height);
	}
};

registry.cornerfocus = {
	drawNode: (element, system, canvas, context, e, center, d) => {
		if(d.tick != null) d.tick ++;	else d.tick = 0;

		var width = d.maxWidth;		var height = d.maxHeight;
		var minGap = getAttribute(element, d, "minGap", 3)
		var maxGap = getAttribute(element, d, "maxGap", 6)
		var speed = getAttribute(element, d, "speed", 3)
		var gap = minGap + (d.tick / speed) % (maxGap - minGap + 1)
		var corner = getAttribute(element, d, "cornerSize", 10)

		context.strokeStyle = getAttribute(element, d, "color");
		context.lineWidth = getAttribute(element, d, "lineWidth", 1);

		var x0 = center.x - width / 2 - gap;
		var x1 = center.x + width / 2 + gap;
		var y0 = center.y - height / 2 - gap;
		var y1 = center.y + height / 2 + gap;

		context.beginPath();
		context.moveTo(x0, y1 - corner)
		context.lineTo(x0, y1)
		context.lineTo(x0 + corner, y1)
		context.stroke();

		context.beginPath();
		context.moveTo(x0, y0 + corner)
		context.lineTo(x0, y0)
		context.lineTo(x0 + corner, y0)
		context.stroke();

		context.beginPath();
		context.moveTo(x1, y1 - corner)
		context.lineTo(x1, y1)
		context.lineTo(x1 - corner, y1)
		context.stroke();

		context.beginPath();
		context.moveTo(x1, y0 + corner)
		context.lineTo(x1, y0)
		context.lineTo(x1 - corner, y0)
		context.stroke();
	}
};
