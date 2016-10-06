/**
 * Register to this element!
 * Must be included before any preset.
 */
var registry = {}

/**
 * Content based renderer, create actual renderer constructor that will hook back into
 * specified renderer.
 */

function dispatchDrawNode(system, canvas, context, n, p, d, dom) {
	$(dom).children().each((i, element) => {
		var calling = registry[element.localName];
		if(calling && calling.drawNode) 
			calling.drawNode(element, system, canvas, context, n, p, d);
	});
}

function dispatchDrawEdge(system, canvas, context, e, s, d, ed, dom) {
	$(dom).children().each((i, element) => {
		var calling = registry[element.localName];
		if(calling && calling.drawEdge) 
			calling.drawEdge(element, system, canvas, context, e, s, d, ed);
	});
}

var verboseRenderer = (system, canvas, context) => { return {
	clear: function() {
		var clearColor = canvas.attributes.clearColor
		if(clearColor) {
			context.fillStyle = clearColor.value;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
	},

	drawNode: function(n, p, d) {
		d.maxWidth =  d.dom.attributes.width? d.dom.attributes.width.value : 0;
		d.maxHeight = d.dom.attributes.height? d.dom.attributes.height.value : 0;
		dispatchDrawNode(system, canvas, context, n, p, d, d.dom);
	},

	drawEdge: function(e, s, d, ed) {
		dispatchDrawEdge(system, canvas, context, e, s, d, ed, ed.dom);
	}
}; }

function dispatchResponse(n, nd, func, dom) {
	console.log("dom", dom)
	$(dom).children().each((i, element) => {
		var calling = registry[element.localName];
		if(calling && calling[func]) 
			calling[func](n, nd, element);
	});
}

var verboseResponse = {
	wrapper: function(n, nd, func) {
		if(n) dispatchResponse(n, nd, func, nd.dom);
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

function getAttribute(dom, data, name, normalValue) {
	if(dom.attributes[name]) return dom.attributes[name].value
	if(data[name]) return data[name]
	if(data.dom.attributes[name]) return data.dom.attributes[name].value
	return normalValue
}
