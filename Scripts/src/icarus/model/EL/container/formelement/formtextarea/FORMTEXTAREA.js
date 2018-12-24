/** @module */
import FORMELEMENT, { ATTRIBUTES, EL, LABEL, MODEL } from '../FORMELEMENT.js';
import TEXTAREA from '../../../textarea/TEXTAREA.js';
/** Represents a <TEXTAREA> for an Icarus Form       
    @class
    @extends FORMELEMENT
*/
export default class FORMTEXTAREA extends FORMELEMENT {
	/** Construct a Text Area
	    @param {EL} node The parent object
	    @param {MODEL} model The textarea model
	*/
	constructor(node, model) {
		super(node, 'DIV', model);
		this.input = new TEXTAREA(this.body.pane, new MODEL(new ATTRIBUTES({
			'class': 'form-control',
			'name': model.attributes.name
		})), model.attributes.value || '');
	}
}
export { ATTRIBUTES, EL, LABEL, MODEL, TEXTAREA };