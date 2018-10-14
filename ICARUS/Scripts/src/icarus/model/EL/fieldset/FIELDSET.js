/** @module */
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../container/CONTAINER.js';
import FORMELEMENTGROUP from '../container/formelement/FORMELEMENTGROUP.js';
import LEGEND from '../legend/LEGEND.js';
/** Construct a Form Fieldset
    @class
    @extends CONTAINER
*/
export default class FIELDSET extends CONTAINER {
	/** A fieldset that contains form elements
	    @param {FORM} node The parent object
	    @param {MODEL} model The model
	*/
	constructor(node, model) {
        super(node, 'FIELDSET', model, ['FORMELEMENTGROUP']);
        this.addCase('FORMELEMENTGROUP', () => this.addFormElementGroup(model));
		//this.addClass('form-group-container');
		//this.body.addClass('form-group'); // The expandable portion of the section  
		this.populate(model.children);
	}
	construct() {
		if (this.dataId > 0) {
			if (this.data.legend) {
				this.legend = new LEGEND(this.body.pane, new MODEL(), this.data.legend);
			}
		}
    }
    /** Constructs a Form Element Group for this Fieldset
        @todo Verify that this overrides the initial case constructor
	    @param {MODEL} model Object model
	    @returns {FORMELEMENTGROUP} A Form Fieldset element
	*/
    addFormElementGroup(model) {
        this.children.push(new FORMELEMENTGROUP(this.body.pane, model));
        return this.addGroup(this.children[this.children.length - 1]);
    }
}
export { ATTRIBUTES, EL, MODEL };