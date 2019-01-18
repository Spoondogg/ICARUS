/** @module */
import LIST, { ATTRIBUTES, EL, LI, MODEL } from '../LIST.js';
/** A generic unorganized list that can be collapsed
    @class
    @extends LIST
*/
export default class UL extends LIST {
	/** Constructs an Unordered List
	    @param {EL} node The node to contain this element
	    @param {MODEL} model The element model
	*/
    constructor(node, model) {
        super(node, model, 'UL');
	}
}
export { ATTRIBUTES, EL, LI, LIST, MODEL }