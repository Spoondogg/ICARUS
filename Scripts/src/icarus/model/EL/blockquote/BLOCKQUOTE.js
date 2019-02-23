/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A BLOCKQUOTE element
    @class
    @extends EL
*/
export default class BLOCKQUOTE extends EL {
	/** Constructs a BLOCKQUOTE element
	    @param {EL} node Node
	    @param {MODEL} model Model
	 */
	constructor(node, model) {
		super(node, 'BLOCKQUOTE', model);
	}
}
export { ATTRIBUTES, EL, MODEL }