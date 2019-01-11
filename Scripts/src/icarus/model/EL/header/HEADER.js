/** @module */
import EL from '../EL.js';
/** A generic header element   
    @class
    @extends EL
*/
export default class HEADER extends EL {
	/** Constructs a Header
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	    @param {number} depth Headers can range from H1 to H6. Undefined returns a standard HEADER element
	 */
	constructor(node, model, depth = 0) {
		super(node, depth ? 'H' + depth : 'HEADER', model, model.label || '');
		this.depth = depth;
	}
}