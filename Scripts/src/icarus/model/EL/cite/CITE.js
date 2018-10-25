/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A CITE element
    @class
    @extends EL
*/
export default class CITE extends EL {
	/** Constructs a CITE element
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The object attributes
	    @param {string} innerHtml The object contents (html)
	 */
	constructor(node, model, innerHtml) {
		super(node, 'CITE', model, innerHtml);
	}
}
export { ATTRIBUTES, EL, MODEL };