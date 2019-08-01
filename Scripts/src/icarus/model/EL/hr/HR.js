/** @module */
import EL from '../EL.js';
/** A horizontal ruler */
export default class HR extends EL {
	/** Constructs a horizontal rule
	    @param {EL} node Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, 'HR', model);
	}
}