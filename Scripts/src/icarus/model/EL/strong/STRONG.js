/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A BLOCKQUOTE element
    @class
    @extends EL
*/
export default class STRONG extends EL {
	/** Constructs a STRONG element
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The object attributes
	    @param {string} innerHtml The object contents (html)
	 */
	constructor(node, model, innerHtml) {
        super(node, 'STRONG', model, innerHtml);
	}
}
export { ATTRIBUTES, EL, MODEL };