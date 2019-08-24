/** @module */
import LIST, { ATTR, ATTRIBUTES, Collapse, Collapsible, DATA, EL, Expand, LI, MODEL } from '../LIST.js';
/** A generic unorganized list that can be collapsed
    @class
*/
export default class UL extends LIST {
	/** Constructs an Unordered List
	    @param {EL} node Node
	    @param {MODEL} [model] Model
	*/
	constructor(node, model) {
		super(node, model, 'UL');
	}
}
export { ATTR, ATTRIBUTES, Collapse, Collapsible, DATA, EL, Expand, LI, LIST, MODEL }