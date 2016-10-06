/**
 * Before setting up helper, the canvas and particle system must be set.
 * Besides canvas and particle system, an actual renderer with constructor
 * and drawNode, drawEdge interfaces must be loaded.
 */

function setup(dom, canvas, system, createRenderer) {
	var context = canvas.getContext("2d");
	system.renderer = {
		system: null,
		actualRenderer: null,
		
		redraw: () => {
			actualRenderer.clear();
			system.eachEdge((e, s, d) => actualRenderer.drawEdge(e, s, d, e.data));
			system.eachNode((n, p) => actualRenderer.drawNode(n, p, n.data));
		},

		init: (anySystem) => {
			system = anySystem;
			actualRenderer = createRenderer(system, canvas, context);
			system.renderer.resize();
		},

		resize: () => {
			canvas.width = dom.width()
			canvas.height = dom.height()
			system.screenSize(dom.width(), dom.height());
			system.screenPadding(0);
			system.renderer.redraw();
		},
	};

	$(window).resize(system.renderer.resize)
}

function resolveInherit(node, root) {
	var dom = node;
	for(var i = 0; i < node.classList.length; i ++) {
		var target = "prototype." + node.classList[i]
		var cnodes = root.find(target).get(0).childNodes
		for(var j = cnodes.length - 1; j >= 0; j --)
			dom.insertBefore(cnodes[j].cloneNode(true), dom.firstChild)
	}

	console.log("dom", dom)
	return dom;
}

/**
 * Remove all elements with tag 'prototype', 'node' or 'edge' from the html.
 * And add them to the particle system meantime.
 */

function convert(system, visitor, root) {
	if(!root) root = $("*");

	root.find("node").each((index, node) => {
		if(!node.id) node.id = "node" + index;

		var nodeValue = { id: node.id, dom: resolveInherit(node, root) };
		if(visitor && visitor.visitNode) visitor.visitNode(nodeValue)
		system.addNode(node.id, nodeValue);
	});
	root.find("node").remove();

	root.find("edge").each((index, edge) => {
		var esrc = edge.attributes['src'].value || edge.attributes['source'].value; if(!esrc) return;
		var edest = edge.attributes['dest'].value || edge.attributes['destination'].value; if(!edest) return;

		var edgeValue = { src: esrc, source: esrc, dest: edest, destination: edest, dom: resolveInherit(edge, root) };
		if(visitor && visitor.visitEdge) visitor.visitEdge(edgeValue)
		system.addEdge(esrc, edest, edgeValue);
	});
	root.find("edge").remove();

	root.find("prototype").remove();
}

/**
 * Add controller for pressing and dragging.
 * Parameter response could designate focus or unfocus function.
 * Focus is fired when you start dragging a node.
 * Unfocus is fired when you stop dragging a node.
 */

function controlDrag(dom, canvas, system, response) {
	var drag = {
		mousePoint: null,
		selected: null,
		nearest: null,
		dragged: null,
		getMousePoint : function(element) {
			var pos = dom.offset();
			drag.mousePoint = arbor.Point(
				element.pageX - pos.left, element.pageY - pos.top)
			return drag.mousePoint;
		},

		click: function(element) {
			nearest = system.nearest(drag.getMousePoint(element))
			selected = dragged = nearest;
			
			if(response && response.focus&& selected)
				response.focus(selected.node, selected.node.data)

			if(dragged.node) dragged.node.fixed = true

			dom.bind('mousemove', drag.drag)
			$(window).bind('mouseup', drag.drop)

			return false
		},

		drag: function(element){
			if (!nearest) return;
			if (dragged && dragged.node) dragged.node.p
				= system.fromScreen(drag.getMousePoint(element))

			return false
		},

		drop: function(){
			if (!dragged || !dragged.node) return
			if (dragged.node) dragged.node.fixed = false
			if(response && response.unfocus && selected)
				response.unfocus(selected.node, selected.node.data)

			dragged.node.tempMass = 50
			dragged = null
			selected = null

			dom.unbind('mousemove', drag.drag)
			$(window).unbind('mouseup', drag.drop)

			mousePoint = null
			return false
		}
	}
	dom.mousedown(drag.click);
}

/**
 * Add controller for hovering.
 */

function controlHover(dom, canvas, system, response) {
	var hover = {
		nearest: null, 
		move: function(element) {
			var lastNearest = hover.nearest;
			var pos = dom.offset();
			var mousePoint = arbor.Point(
				element.pageX - pos.left, element.pageY - pos.top);
			nearest = system.nearest(mousePoint)
			if(nearest != lastNearest) {
				var lastNode = lastNearest? lastNearest.node : null;
				var lastValue = lastNode? lastNode.data : null;
				if(response && response.unhover) response.unhover(lastNode, lastValue);	

				var currentNode = nearest? nearest.node : null;
				var currentValue = currentNode? currentNode.data : null;			
				if(response && response.hover) response.hover(currentNode, currentValue);
			}
		}
	}
	dom.bind('mousemove', hover.move);
}
