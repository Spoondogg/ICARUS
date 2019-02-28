/** @module */
import FORMELEMENTGROUP, { ATTRIBUTES, CONTAINER, EL, Expand, MODEL } from '../container/formelement/FORMELEMENTGROUP.js';
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
        this.addClass('fieldset');
	}
	construct(model) {
		console.log(this.className + '.construct()');
		return this.callback(() => {
			console.log(this.className + ' callback', this);
			if (this.dataId > 0) {
				this.createEditableElement('legend', this.body.pane);
			} else {
				console.log('No data exists for ' + this.className);
				this.navheader.el.dispatchEvent(new Expand(this));
			}
			if (model) {
				if (model.children) {
					return this.populate(model.children).then(
						() => this.body.el.dispatchEvent(new Expand(this)));
				}
			}
			return this.ifEmpty();
		}, 'Unable to construct ' + this.className);
	}
	/** Constructs a Form Element Group for this Fieldset
        @todo Verify that this overrides the initial case constructor
	    @param {MODEL} model Object model
	    @returns {FORMELEMENTGROUP} A Form Fieldset element
	*/
	addFormElementGroup(model) {
		return this.addChild(new FORMELEMENTGROUP(this.body.pane, model));
	}
}
export { ATTRIBUTES, EL, MODEL }