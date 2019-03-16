/** @module */
import DIALOG, { ATTRIBUTES, EL, MODEL } from '../DIALOG.js';
import FORM from '../../form/FORM.js';
/** A DIALOG with an embedded FORM that can be used to recieve input
    @description Creates a modal and displays a text well and any included buttons
    @class
    @extends DIALOG
*/
export default class PROMPT extends DIALOG {
	/** Constructs a PROMPT
        @param {MODEL} model The object model
    */
	constructor(model) {
		super(model);
		this.addClass('prompt');
		/** @type {FORM} */
		this.form = null; //this.createForm(model.form);
	}
	/** Creates the FORM or constructs a new empty FORM
	    @param {MODEL} model FORM
	    @returns {Promise<FORM>} Promise to return a FORM
	*/
	createForm(model = new MODEL()) {
		return new Promise((resolve, reject) => {
			//this.getDialog().getLoader().log(50, 'Creating Form', true).then((loader) => {
			try {
				if (model.formtype === 'FORMPOST') {
					//loader.log(75, 'Generating FormPost').then(() => 
					FORM.createFormPostForm(this.body, model).then((form) => this.configureForm(form, model).then((f) => resolve(f)));
					//));
				} else if (model.formtype === 'CONTAINER') {
					//loader.log(75, 'Generating Container').then(() => 
					FORM.createContainerForm(this.body, model).then((form) => this.configureForm(form, model).then((f) => resolve(f)));
					//));
				} else {
					//loader.log(75).then(() => 
					FORM.createEmptyForm(this.body, false).then((form) => this.configureForm(form, model).then((f) => resolve(f)));
					//));
				}
			} catch (e) {
				//loader.log(100, 'Failed to create Form').then(() => reject(e));
				console.error('PROMPT.createForm() Failed to create Form', model, this);
				reject(e)
			}
			//});
		});
	}
	/** Adds buttons, inputs etc to the given FORM
	    @param {FORM} form The form to configure
	    @param {MODEL} model The FORM model
	    @returns {Promise<FORM>} Promise Chain
	*/
	configureForm(form, model) {
		return new Promise((resolve, reject) => {
			try {
				form.addInputs(model.inputs);
				form.addButtons(model.buttons);
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
export { ATTRIBUTES, DIALOG, EL, FORM, MODEL }