
/**
    SVG_LEGACY
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

    SVG_LEGACY(
        '0 0 28 28',
        '#FFF',
        'M24.921,6.199v18.722c0,0.861-0.698,1.561-1.56,1.561H4.639c-0.861,0-1.56-0.699-1.56-1.561V6.199
        c0-0.862,0.699-1.561,1.56-1.561h1.561v-1.56c0-0.862,0.698-1.56,1.561-1.56c0.862,0,1.56,0.698,1.56,1.56v1.56h3.12v-1.56
        c0-0.862,0.699-1.56,1.561-1.56c0.861,0,1.56,0.698,1.56,1.56v1.56h3.121v-1.56c0-0.862,0.699-1.56,1.56-1.56
        c0.861,0,1.56,0.698,1.56,1.56v1.56h1.562C24.223,4.639,24.921,5.337,24.921,6.199z M21.8,10.88H6.199v1.559H21.8V10.88z
        M21.8,15.56H6.199v1.562H21.8V15.56z M21.8,20.239H6.199v1.562H21.8V20.239z',
        header.command[(header.command.length-1)]
    )
    svg.icon[doc.html.dom.article.section[0].id].path

    @param {string} viewbox The 4 coordinates representing the SVG viewbox
    @param {object} svgObj The svg object retrieved from the server
    @param {object} node The element that this SVG is appended to
    @param {string} fill A hex based color value

*/
const SVG_LEGACY = function (viewbox, svgObj, node, fill) {
    // SVG Object
    node.svg = node.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
    //parentObj.svg.setAttribute('viewBox',viewbox);
    //parentObj.svg.setAttribute('viewBox','0 0 ' + parentObj.offsetWidth + ' ' + parentObj.offsetHeight);
    node.svg.setAttribute('viewBox', '0 0 32 32'); // temporary fixed size	
    node.svg.path = node.svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
    node.svg.path.setAttribute('fill', fill ? fill : svgObj.fill);
    node.svg.path.setAttribute('d', svgObj.path);
};

/**
    Creates a scaleable vector graphic
    @param {EL} node The element that this SVG is appended to
    @param {string} viewbox The 4 coordinates representing the SVG viewbox
    @param {object} svgObj The svg object retrieved from the server
    @param {string} fill A hex based color value
*/
class SVG extends EL {
    constructor(node, viewbox, svgObj, fill) {
        super(node, 'SVG', { 'viewBox': '0 0 32 32' });
        this.path = new EL(super.el, 'PATH', {
            'fill': fill ? fill : svgObj.fill,
            'd': svgObj.fill
        });
    }
}