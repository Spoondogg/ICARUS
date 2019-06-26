/** @module */
import DIALOG, { ATTRIBUTES, DIALOGMODEL, DIV, EL, ICONS, MODEL } from '../DIALOG.js';
import FORM from '../../form/FORM.js';
/** A DIALOG with an embedded FORM that can be used to recieve input
    @description Creates a modal and displays a text well and any included buttons
    @class
    @extends DIALOG
*/
export default class PROMPT extends DIALOG {
	/** Constructs a PROMPT
        @param {DIALOGMODEL} model DIALOG MODEL
    */
	constructor(model) {
		super(model);
		this.addClass('prompt');
		/** @type {FORM} */
		this.form = null; //this.createForm(model.form);
	}
	/** Creates the FORM or constructs a new empty FORM
	    @param {FormModel} [model] FormModel
	    @returns {Promise<FORM>} Promise to return a FORM
	*/
    createForm(model = new MODEL().set({
        container: this.container
    })) {
        //console.log(this.toString() + '.createForm()', model);
		return new Promise((resolve, reject) => {
            try {
                // @todo These should just be their own classes!!!
				if (model.formtype === 'FORMPOST') {
					FORM.createFormPostForm(this.body.pane, model).then((form) => this.configureForm(form, model).then((f) => resolve(f)));
				} else if (model.formtype === 'CONTAINER') {
                    FORM.createContainerForm(this.body.pane, model).then((form) => this.configureForm(form, model).then((f) => resolve(f)));
				} else {
                    FORM.createEmptyForm(this.body.pane, false).then((form) => this.configureForm(form, model).then((f) => resolve(f)));
				}
			} catch (e) {
				console.error('PROMPT.createForm() Failed to create Form', model, this);
				reject(e)
			}
		});
	}
	/** Sets required defaults for a PROMPT FORM
	    @param {FORM} form The form to configure
	    @param {ModelWithContainer} model The FORM model
	    @returns {Promise<FORM>} Promise Chain
	*/
    configureForm(form, model) {
        //console.log(this.toString() + '.configureForm()', form, model);
		return new Promise((resolve, reject) => {
            try {
				form.getDialog = () => this;
				form.getContainer = () => model.container;
				form.container = model.container;
				resolve(form);
			} catch (e) {
				reject(e);
			}
		});
	}
}
export { ATTRIBUTES, DIALOG, DIALOGMODEL, DIV, EL, FORM, ICONS, MODEL }