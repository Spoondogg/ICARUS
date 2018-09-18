/*
    @module
*/
//
/**
    Creates a scaleable vector graphic
    @class
    @extends EL
*/
class SVG extends EL {
	/**
	    Constructs an SVG Object
	    @param {EL} node The element that this SVG is appended to
	    @param {string} viewbox The 4 coordinates representing the SVG viewbox @example '0 0 32 32'
	    @param {object} svgObj The svg object retrieved from the server
	    @param {string} fill A hex based color value
	 */
	constructor(node, viewbox, svgObj, fill) {
		super(node, 'SVG', { 'viewBox': viewbox }); // '0 0 32 32'
		this.path = new EL(super.el, 'PATH', {
			'fill': fill ? fill : svgObj.fill,
			'd': svgObj.fill
		});
	}
}
/**
    A legacy approach to creating an SVG
    @class
    @deprecated
    @description 
    Preload scalable vector graphic Object into memory
    viewbox: 	    object dimensions ie: '0 0 48 48' equals a 48px box
    fill:			object color value (hex,rgba) '#fff'
    path:           object path values
    svgObj:         SVG Object loaded into memory via loadJSON(svgURL);
    viewbox:
					minx—the beginning x coordinate
					miny—the beginning y coordinate
					width—width of the view box
					height—height of the view box
    
*/
class SVG_LEGACY {
	constructor(node, viewbox, svgObj, fill) {
		super(node, 'SVG', new MODEL());
		this.svg = node.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'SVG'));
		this.svg.setAttribute('viewBox', '0 0 32 32'); // temporary fixed size	
		this.svg.path = this.el.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
		this.svg.path.setAttribute('fill', fill ? fill : svgObj.fill);
		this.svg.path.setAttribute('d', svgObj.path);
	}
}