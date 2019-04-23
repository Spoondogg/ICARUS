/** @module */
import FORMELEMENTGROUP, { ATTRIBUTES, CONTAINER, EL, MODEL } from '../container/formelement/FORMELEMENTGROUP.js';
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
        super(node, 'FIELDSET', model, ['FORMELEMENTGROUP', 'TEXTBLOCK']);
		this.addClass('fieldset');
	}
	constructElements() {
		return this.chain(() => {
			if (this.dataId > 0) {
				this.createEditableElement('legend', this.body.pane);
			} else {
				this.ifEmpty();
			}
		});
	}
	/** Constructs a Form Element Group for this Fieldset
        @todo Verify that this overrides the initial case constructor
	    @param {MODEL} model Object model
	    @returns {FORMELEMENTGROUP} A Form Fieldset element
	*/
	addFormElementGroup(model) {
		return this.addChild(new FORMELEMENTGROUP(this.body.pane, model));
    }
    /** Returns an array of FORMELEMENTGROUP(s), optionally filtered to the specified name
        @param {string} [name] Optional name to filter search
        @returns {Array<FORMELEMENTGROUP>} An array of FORMELEMENTGROUP(s)
    */
    getFormElementGroup(name = null) {
        return this.get(name, 'FORMELEMENTGROUP');
    }
}
export { ATTRIBUTES, EL, FORMELEMENTGROUP, MODEL }