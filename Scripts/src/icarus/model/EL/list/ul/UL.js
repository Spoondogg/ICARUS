/** @module */
import LIST, { ATTRIBUTES, Collapse, Collapsible, EL, Expand, LI, MODEL } from '../LIST.js';
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
export { ATTRIBUTES, Collapse, Collapsible, EL, Expand, LI, LIST, MODEL }