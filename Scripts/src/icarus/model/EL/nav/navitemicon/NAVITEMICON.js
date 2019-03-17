/** @module */
import NAVITEM, { ANCHOR, EL, MODEL } from '../navitem/NAVITEM.js'; //, { ANCHOR } 
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
	}
}
export { ANCHOR, EL, MODEL, NAVITEM }