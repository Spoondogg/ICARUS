/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A SPAN Element
    @class
    @extends EL
*/
export default class SPAN extends EL {
	/** Constructs a simple SPAN Element
	    @param {EL} node Parent Node
	    @param {MODEL} [model] Model
    */
	constructor(node, model) {
		super(node, 'SPAN', model);
	}
}
export { ATTRIBUTES, EL, MODEL, SPAN }