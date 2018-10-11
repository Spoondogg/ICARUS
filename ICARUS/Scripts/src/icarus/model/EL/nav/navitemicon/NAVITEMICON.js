/** @module */
import LI, { ANCHOR } from '../../li/LI.js';
//import ANCHOR from '../../a/anchor/ANCHOR.js';
//import DIV from '../../div/DIV.js';
import MENU from '../menu/MENU.js';
/** A navigation item that populates a Bootstrap 3 navbar.
    @description Nav items can be single buttons or dropdowns with nav items nested within them  
    @class
    @extends DIV
*/
export default class NAVITEMICON extends LI {
	/** Constructs the Nav Item Icon
	    @param {EL} node The element that will contain this object
	    @param {MODEL} model The nav-item json object retrieved from the server
	 */
	constructor(node, model) {
		super(node, model);
		this.addClass('nav-item-icon');
		this.el.setAttribute('title', model.anchor.label);
		this.anchor = model.anchor ? new ANCHOR(this, model.anchor) : null;
		//this.addCase('MENU', () => this.addMenu(model));
		//this.addCase('ANCHOR', () => this.addAnchor(model));
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