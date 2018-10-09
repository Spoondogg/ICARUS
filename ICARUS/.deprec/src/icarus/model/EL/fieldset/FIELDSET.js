/** @module */
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../container/CONTAINER.js';
import LEGEND from '../legend/LEGEND.js';
/**
    Construct a Form Fieldset
    @class
    @extends CONTAINER
*/
export default class FIELDSET extends CONTAINER {
	/**
	    A field set / form-group that contains form elements within a section
	    @param {FORM} node The parent object
	    @param {MODEL} model The model
	 */
	constructor(node, model) {
		super(node, 'FIELDSET', model, ['FORMELEMENTGROUP']);
		this.addClass('form-group-container');
		this.body.addClass('form-group'); // The expandable portion of the section  
		this.populate(model.children);
	}
	construct() {
		if (this.dataId > 0) {
			if (this.data.legend) {
				this.legend = new LEGEND(this.body.pane, new MODEL(), this.data.legend);
			}
		}
	}
}
export { ATTRIBUTES, EL, MODEL };