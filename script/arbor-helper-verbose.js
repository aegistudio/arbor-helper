/**
 * Register to this element!
 * Must be included before any preset.
 */
var registry = {}

/**
 * Content based renderer, create actual renderer constructor that will hook back into
 * specified renderer.
 */

function initMaxSize(d) {
	d.maxWidth =  d.dom.attributes.width? d.dom.attributes.width.value : 0;
	d.maxHeight = d.dom.attributes.height? d.dom.attributes.height.value : 0;
}

var verboseRenderer = (system, canvas, context) => { return {
	clear: function() {
		var clearColor = canvas.attributes.clearColor
		if(clearColor) {
			context.fillStyle = clearColor.value;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
	},

	drawNode: function(e, p, d) {
		initMaxSize(d)

		$(d.dom).children().each((i, element) => {
			var calling = registry[element.localName];
			if(calling && calling.drawNode) 
				calling.drawNode(element, system, canvas, context, e, p, d);
		});
	},

	drawEdge: function(e, s, d, ed) {
		initMaxSize(ed)

		$(ed.dom).children().each((i, element) => {
			var calling = registry[element.localName];
			if(calling && calling.drawEdge) 
				calling.drawEdge(element, system, canvas, context, e, s, d, ed);
		});
	}
}; }

var verboseResponse = {
	wrapper: function(n, nd, func) {
		if(n) $(nd.dom).children().each((i, element) => {
			var calling = registry[element.localName];
			if(calling && calling[func]) 
				calling[func](n, nd, element);
		});
	},

	focus: (n, nd) => verboseResponse.wrapper(n, nd, 'focus'),
	unfocus: (n, nd) => verboseResponse.wrapper(n, nd, 'unfocus'),
	hover: (n, nd) => verboseResponse.wrapper(n, nd, 'hover'),
	unhover: (n, nd) => verboseResponse.wrapper(n, nd, 'unhover')
}

function verboseFacade(dom, canvas, particleSystem) {
	setup(dom, canvas, particleSystem, verboseRenderer);
	controlDrag(dom, canvas, particleSystem, verboseResponse);
	controlHover(dom, canvas, particleSystem, verboseResponse);
}

function getAttribute(dom, data, name) {
	if(dom.attributes[name]) return dom.attributes[name].value
	if(data[name]) return data[name]
	if(data.dom.attributes[name]) return data.dom.attributes[name].value
}
