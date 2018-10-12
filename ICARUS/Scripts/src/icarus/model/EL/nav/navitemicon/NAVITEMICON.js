/** @module */
//import LI, { ANCHOR } from '../../li/LI.js';
import MENU from '../menu/MENU.js';
import NAVITEM, { ANCHOR } from '../navitem/NAVITEM.js';
/** A clickable icon with label 
    @class
    @extends LI
*/
export default class NAVITEMICON extends NAVITEM {
	/** Constructs the Nav Item Icon
	    @param {EL} node The element that will contain this object
	    @param {MODEL} model The nav-item json object retrieved from the server
	 */
	constructor(node, model) {
		super(node, model);
		this.addClass('nav-item-icon');
		this.el.setAttribute('title', model.anchor.label);
		// this.anchor = model.anchor ? new ANCHOR(this, model.anchor) : null;
	}
	/** Add a NavItemGroup to this NavItem
	    @param {MODEL} model NavBarNav model
	    @returns {MENU} The newly created element
	*/
	addMenu(model) {
		this.children.push(new MENU(this, model));
		return this.children[this.children.length - 1];
	}
}