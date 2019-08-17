/** @module */
import NAVITEM, { ANCHOR, ATTR, ATTRIBUTES, DATA, EL, MODEL, MODELS } from '../navitem/NAVITEM.js';
/** A clickable icon with label 
    @class
*/
export default class NAVITEMICON extends NAVITEM {
	/** Constructs the Nav Item Icon
	    @param {EL} node Node
	    @param {NavItemModel} [model] Model
	*/
	constructor(node, model) {
		super(node, model);
		this.addClass('nav-item-icon');
	}
}
export { ANCHOR, ATTR, ATTRIBUTES, DATA, EL, MODEL, MODELS, NAVITEM }