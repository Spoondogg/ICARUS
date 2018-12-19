/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A standard control-label for form elements */
export default class LABEL extends EL {
	/** Constructs a generic Label
	    @param {EL} node the parent
	    @param {string} label The innerHtml to be displayed
	 */
	constructor(node, label) {
		super(node, 'LABEL', new MODEL(), label || 'My Label');
	}
	/** Sets the value of this label
        @param {string} name New name to apply
        @returns {void}
    
	rename(name) {
		this.setInnerHTML(name);
	}*/
}
export { ATTRIBUTES, EL, MODEL };