/** @module */
import EL, { ATTRIBUTES, MODEL } from '../../EL.js';
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
}
export { ATTRIBUTES, EL, MODEL }