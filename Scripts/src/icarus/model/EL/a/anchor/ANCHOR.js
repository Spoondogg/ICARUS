/** @module */
import A, { ATTRIBUTES, EL, MODEL, SPAN } from '../A.js';
import GLYPHICON, { DATA, MODELS } from '../../span/GLYPHICON.js';
/** A hyperlink / page anchor    
    @class
*/
export default class ANCHOR extends A {
	/** Constructs a generic Anchor
	    @param {EL} node Node
	    @param {AnchorModel} model Model
	*/
	constructor(node, model = MODELS.anchor()) {
		super(node, model);
		if (model.data.icon) {
			this.icon = new GLYPHICON(this, model);
		}
        this.label = new SPAN(this, MODELS.text(new ATTRIBUTES(), DATA.text(model.data.label)));
	}
}
export { A, ATTRIBUTES, DATA, EL, GLYPHICON, MODEL }