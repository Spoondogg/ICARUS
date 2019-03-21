/** @module */
import A, { ATTRIBUTES, EL, MODEL, SPAN } from '../A.js';
import GLYPHICON from '../../span/GLYPHICON.js';
/** A hyperlink / page anchor    
    @class
    @extends EL
*/
export default class ANCHOR extends A {
	/** Constructs a generic Anchor
	    @constructs ANCHOR
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The object model
	 */
	constructor(node, model) {
		super(node, model);
		if (model.icon) {
			this.icon = new GLYPHICON(this, model.icon);
		}
		this.label = new SPAN(this, new MODEL('label').set('innerHTML', model.label || ''));
	}
}
export { A, ATTRIBUTES, EL, GLYPHICON, MODEL }