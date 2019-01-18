/** @module */
import EL, { ATTRIBUTES, MODEL } from '../../EL.js';
//import ANCHOR from '../a/anchor/ANCHOR.js';
//import UL from '../ul/UL.js';
/** An abstract List Item Constructor
    @class
    @extends EL
*/
export default class ITEM extends EL {
	/** Constructs a List Item
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
        @param {string} element HTML Element Tag
	*/
	constructor(node, model, element = 'LI') {
		super(node, element, model);
	}
	/** Add an Anchor to this element
	    @todo This doesn't belong here!
	    @param {ANCHOR} model Anchor model
	    @returns {MENU} The newly created element
	
	addAnchor(model) {
		this.children.push(new ANCHOR(this, model));
		return this.children[this.children.length - 1];
	}*/
}
export { ATTRIBUTES, EL, MODEL }