/** @module */
import EL, {
	ATTRIBUTES,
	MODEL
} from '../EL.js';
/** A BLOCKQUOTE element
    @class
    @extends EL
*/
export default class BLOCKQUOTE extends EL {
	/** Constructs a BLOCKQUOTE element
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The object attributes
	    @param {string} innerHtml The object contents (html)
	 */
	constructor(node, model, innerHtml) {
		super(node, 'BLOCKQUOTE', model, innerHtml);
	}
}
export {
	ATTRIBUTES,
	EL,
	MODEL
};