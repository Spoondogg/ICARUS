/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A SPAN Element
    @class
    @extends EL
*/
export default class SPAN extends EL {
	/** Constructs a simple SPAN Element
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	    @param {string} innerHtml The object contents (html)
    */
	constructor(node, model, innerHtml) {
		super(node, 'SPAN', model, innerHtml);
	}
}
export { ATTRIBUTES, EL, MODEL, SPAN }