/** @module */
import A, { ATTRIBUTES, EL, MODEL, SPAN } from '../A.js';
import GLYPHICON, { MODELS } from '../../span/GLYPHICON.js';
/** A hyperlink / page anchor    
    @class
    @extends EL
*/
export default class ANCHOR extends A {
	/** Constructs a generic Anchor
	    @param {EL} node Node
	    @param {AnchorModel} model Model
	 */
	constructor(node, model = MODELS.anchor()) {
		super(node, model);
		if (model.icon) {
			this.icon = new GLYPHICON(this, model);
		}
		this.label = new SPAN(this, MODELS.text(model.label));
	}
}
export { A, ATTRIBUTES, EL, GLYPHICON, MODEL }