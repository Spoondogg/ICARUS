/** @module */
import UL, { ATTRIBUTES, EL, LI, MODEL } from '../../list/ul/UL.js';
import ANCHOR from '../../a/anchor/ANCHOR.js';
import Clickable from '../../../../interface/Clickable/Clickable.js';
import MENU from '../menu/MENU.js';
/** A Navigation Item
    @class
    @extends LI
*/
export default class NAVITEM extends LI {
	/** Constructs a Nav Item (LI)
	    @param {UL} node The element that will contain this object
	    @param {MODEL} model The nav-item json object retrieved from the server
	*/
	constructor(node, model) {
        super(node, model); //new MODEL(model.attributes)
        this.addClass('nav-item');
        this.implement(new Clickable(this));
		this.anchor = new ANCHOR(this, model);
		this.addCallback('MENU', () => this.addMenu(model));
		if (model.label) { this.el.setAttribute('title', model.label); }
    }
	/** Add a MENU to this MENU
	    @param {MODEL} model NavBarNav model
	    @returns {MENU} The newly created element
    */
	addMenu(model) {
		this.children.push(new MENU(this, model));
		return this.children[this.children.length - 1];
	}
}
export { ANCHOR, ATTRIBUTES, EL, LI, MENU, MODEL, UL }