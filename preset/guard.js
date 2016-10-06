function newAdapter() {	
	var adapt = new Object();
	adapt.guard = (element, id) => true
	adapt.drawNode = (element, system, canvas, context, n, p, d) => {
			if(adapt.guard(element, d.id)) dispatchDrawNode(system, canvas, context, n, p, d, element) }
	adapt.drawEdge = (element, system, canvas, context, e, s, d, ed) => {
			if(adapt.guard(element, ed.id)) dispatchDrawEdge(system, canvas, context, e, s, d, ed, element) }
	adapt.focus = (n, nd, element) => { if(adapt.guard(element, nd.id)) dispatchResponse(n, nd, 'focus', element) }
	adapt.unfocus = (n, nd, element) => { if(adapt.guard(element, nd.id)) dispatchResponse(n, nd, 'unfocus', element) }
	adapt.hover = (n, nd, element) => { if(adapt.guard(element, nd.id)) dispatchResponse(n, nd, 'hover', element) }
	adapt.unhover = (n, nd, element) => { if(adapt.guard(element, nd.id)) dispatchResponse(n, nd, 'unhover', element) }
	return adapt;
};


registry.onhover = newAdapter();
registry.onhover.super = Object();
registry.onhover.super.onhover = registry.onhover.onhover;
registry.onhover.super.unonhover = registry.onhover.unonhover;
registry.onhover.onhover = (n, nd, element) => {
	element.onhover = true
	registry.onhover.super.onhover(n, nd, element);
};
registry.onhover.unonhover = (n, nd, element) => {
	element.onhover = false
	registry.onhover.super.unonhover(n, nd, element);
};
registry.onhover.guard = (element, ne) => element.onhover;


registry.onselect = newAdapter();
registry.onselect.domain = new Object();
registry.onselect.super = new Object();
registry.onselect.super.focus = registry.onselect.focus;
registry.onselect.focus = (n, nd, element) => {
	var selector = "*"
	if(element.attributes.domain)
		selector = element.attributes.domain.value

	registry.onselect.domain[selector] = nd.id
	registry.onselect.super.focus(n, nd, element);
};
registry.onselect.guard = (element, id) => {
	var selector = "*";
	if(element.attributes.domain)
		selector = element.attributes.domain.value;
	return registry.onselect.domain[selector] == id;
}
