/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A STRONG element
    @class
    @extends EL
*/
export default class STRONG extends EL {
	/** Constructs a STRONG element
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The object attributes
	*/
	constructor(node, model) {
		super(node, 'STRONG', model);
	}
}
export { ATTRIBUTES, EL, MODEL }