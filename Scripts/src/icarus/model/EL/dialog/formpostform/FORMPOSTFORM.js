/** @module */
import DIALOG, { ATTRIBUTES, EL, MODEL } from '../DIALOG.js';
import FORM from '../../form/FORM.js';
/** A Dialog with an embedded FORM that can be used to receive input
    @description Creates a modal and displays a text well and any included buttons
    @class
    @extends DIALOG
*/
export default class FORMPOSTFORM extends DIALOG {
	/** Constructs a FORMPOST Form
        @param {MODEL} model The model
	    param {string} label The label
	    param {string} text The html text that is displayed in the prompt's well
	    param {string} className The container className that the FormPost represents (ie: JUMBOTRON)
        param {string} dataIdLabel The key (dataId, attributesId, descriptionId) to add object to
        param {number} formPostId Optional FormPost Id to edit
    */
	constructor(model) {
		super(new MODEL().set({
            label: model.className + model.dataIdLabel + '}' //'[' + model.formPostId + ']{' +			
		}));
        this.addClass('prompt');
        this.addClass('formpostform');
        /** The DIALOG FORM 
            @type {FORM}
        */
        this.form = FORM.createFormPostForm(this.body, model).then((form) => {
            form.getDialog = () => this;
        });
    }
}
export { ATTRIBUTES, DIALOG, EL, FORM, MODEL };