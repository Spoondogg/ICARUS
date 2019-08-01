/** @module */
import NAVBAR, { ANCHOR, Collapse, Collapsible, EL, Expand, LIST, MENU, MODEL, NAVITEM, NAVITEMICON } from '../NAVBAR.js';
/** A NAVBAR that acts as a CONTAINER Header
    @class
*/
export default class NAVFOOTER extends NAVBAR {
	/** Constructs a NAVBAR that acts as a CONTAINER Header
	    @param {EL} node Node
	    @param {MenuModel} model Model
	*/
	constructor(node, model) {
		super(node, model, true);
		this.addClass('nav-footer');
		this.addOptionsMenu();
	}
}
export { ANCHOR, Collapse, Collapsible, EL, Expand, LIST, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON }