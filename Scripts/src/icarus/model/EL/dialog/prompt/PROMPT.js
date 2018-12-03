/** @module */
import DIALOG, { ATTRIBUTES, EL, MODEL } from '../DIALOG.js';
import FORM from '../../form/FORM.js';
//import FORMINPUT from '../../container/formelement/forminput/FORMINPUT.js';
//import FORMPOSTINPUT from '../../container/formelement/formpostinput/FORMPOSTINPUT.js';
/** A Dialog with an embedded FORM that can be used to recieve input
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
        this.form = this.createForm(model.form);
    }
    /** Creates the given form or an empty one
        @param {MODEL} model Object model
        @returns {Promise<FORM>} Promise to return a FORM
    */
    createForm(model) {
        return new Promise((resolve, reject) => {
            try {
                if (model.type === 'FORMPOST') {
                    FORM.createFormPostForm(this.body, model).then((frm) => {
                        this.configureForm(frm, model).then((f) => {
                            resolve(f);
                        });
                    });
                } else if (model.type === 'CONTAINER') {
                    FORM.createContainerForm(this.body, model).then((frm) => {
                        this.configureForm(frm, model).then((f) => {
                            resolve(f);
                        });
                    });
                } else {
                    FORM.createEmptyForm(this.body, false).then((frm) => {
                        this.configureForm(frm, model).then((f) => {
                            resolve(f);
                        });
                    });
                }            
            } catch (e) {
                reject(e);
            }
        });
    }
    /** Adds buttons, inputs etc to the given FORM
        @param {FORM} form The form to configure
        @param {MODEL} model The FORM model
        @returns {Promise<FORM>} callback
    */
    configureForm(form, model) {
        return new Promise((resolve, reject) => {
            try {
                form.addInputs(model.inputs);
                form.addButtons(model.buttons);
                form.getDialog = () => this;
                resolve(form);
            } catch (e) {
                reject(e);
            }
        });
    }
}
export { ATTRIBUTES, DIALOG, EL, FORM, MODEL };