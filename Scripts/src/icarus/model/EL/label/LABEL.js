/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A standard control-label for form elements */
export default class LABEL extends EL {
	/** Constructs a generic Label
	    @param {EL} node Node
	    @param {MODEL} model Model
	*/
    constructor(node, model) {
        super(node, 'LABEL', model);
        this.required(model.innerHTML);
	}
}
export { ATTRIBUTES, EL, MODEL }