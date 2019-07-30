/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A DIV element
    @class
    @extends EL
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
export { ATTRIBUTES, EL, MODEL }