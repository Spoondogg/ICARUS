/** @module */
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../container/CONTAINER.js';
import FORMELEMENTGROUP from '../container/formelement/FORMELEMENTGROUP.js';
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
		//this.addCase('FORMELEMENTGROUP', () => this.addFormElementGroup(model));		
	}
	/** Perform any async actions and populate this Container
	    param {Array<MODEL>} children Array of elements to add to this container's body
	    @returns {Promise<ThisType>} callback
	*/
	construct() {
		return this.callback(() => {
			if (this.dataId > 0) {
				//if (this.label) {
				//	this.legend = new LEGEND(this.body.pane, new MODEL(), this.data.legend);
				//}
			}
			this.populate(this.model.children);
		});
		/*return new Promise((resolve, reject) => {
		    try {
		        this.createEditableElement('legend', this.body.pane).then((legend) => $(legend.el).insertBefore(this.body.pane.el));
		        if (this.dataId > 0) {
		            //if (this.label) {
		            //	this.legend = new LEGEND(this.body.pane, new MODEL(), this.data.legend);
		            //}
		        }
		        this.populate(children).then(() => resolve(this));
		    } catch (e) {
		        reject(e);
		    }
		});*/
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