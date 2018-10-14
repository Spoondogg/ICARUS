/** @module */
import UL, { ANCHOR, ATTRIBUTES, EL, LI, MODEL } from '../../ul/UL.js';
import MENU from '../menu/MENU.js';
/** A wide navigation button
    @description Nav items can be single buttons or dropdowns with nav items nested within them  
    @class
    @extends LI
*/
export default class NAVITEM extends LI {
	/** Constructs a Nav Item 
	    @param {UL} node The element that will contain this object
	    @param {MODEL} model The nav-item json object retrieved from the server
	 */
	constructor(node, model) {
		super(node, new MODEL(model.attributes));
		this.addClass('nav-item');
		this.anchor = new ANCHOR(this, model);
		this.addCase('MENU', () => this.addMenu(model));
		if (model.label) {
			this.el.setAttribute('title', model.label);
		}
	}
	/** Add a {@link MENU} to this element
	    @param {MODEL} model NavBarNav model
	    @returns {MENU} The newly created element
	 */
	addMenu(model) {
		this.children.push(new MENU(this, model));
		return this.children[this.children.length - 1];
	}
}
export { ANCHOR, ATTRIBUTES, EL, LI, MENU, MODEL, UL };