/** @module */
import SPAN, {
	ATTRIBUTES,
	EL,
	MODEL
} from '../span/SPAN.js';
/** A hyperlink / page anchor    
    @class
    @extends EL
*/
export default class A extends EL {
	/** Constructs a generic A (anchor) Element
	    @constructs A
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The object model
	 */
	constructor(node, model) {
		super(node, 'A', new MODEL());
		this.href = model.attributes.href || '#';
	}
	/** Sets the target for this anchor
	    @param {string} target Target url
	    @returns {void}
	*/
	setTarget(target) {
		this.target = target;
		this.el.setAttribute('target', target);
	}
}
export {
	ATTRIBUTES,
	EL,
	MODEL,
	SPAN
};