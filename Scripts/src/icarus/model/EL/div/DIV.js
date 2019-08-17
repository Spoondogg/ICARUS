/** @module */
import EL, { ATTR, ATTRIBUTES, DATA, MODEL } from '../EL.js';
/** A DIV element
    @class
*/
export default class DIV extends EL {
	/** Constructs a DIV element
	    @param {EL} node Node
	    @param {MODEL} [model] Model
	*/
	constructor(node, model) {
		super(node, 'DIV', model);
	}
}
export { ATTR, ATTRIBUTES, DATA, EL, MODEL }