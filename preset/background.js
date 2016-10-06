registry.expand = {
	drawNode: (element, system, canvas, context, e, center, d) => {
		d.maxWidth = getAttribute(element, d, "width")
		d.maxHeight = getAttribute(element, d, "height");
	}
};

registry.background = {
	drawNode: (element, system, canvas, context, e, center, d) => {
		var width = d.maxWidth;
		var height = d.maxHeight;

		context.fillStyle = getAttribute(element, d, "color");
		context.fillRect(center.x - width / 2, center.y - height / 2, width, height);
	}
};
