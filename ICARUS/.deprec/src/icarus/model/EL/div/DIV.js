/**
    @module
*/
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/**
    A basic box element
    @class
    @extends EL
*/
export default class DIV extends EL {
	/**
	    Constructs a DIV element
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The object attributes
	    @param {string} innerHtml The object contents (html)
	 */
	constructor(node, model, innerHtml) {
		super(node, 'DIV', model, innerHtml);
	}
}
export { ATTRIBUTES, EL, MODEL };