/** @module */
import EL from '../EL.js';
/** A Paragraph Element
    @class
    @extends EL
*/
export default class P extends EL {
	/** Constructs a Paragraph
	    @param {EL} node Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, 'P', model);
	}
}