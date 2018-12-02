/** @module */
import { DATAELEMENTS, createInputModel } from '../../../../../enums/DATAELEMENTS.js';
import FORMELEMENT, { ATTRIBUTES, CONTAINER, EL, MODEL } from '../../formelement/FORMELEMENT.js';
import DIV from '../../../div/DIV.js';
//import FORMPOSTPROMPT from '../../../dialog/prompt/formpostprompt/FORMPOSTPROMPT.js';
import FORMPOSTFORM from '../../../dialog/formpostform/FORMPOSTFORM.js';
import INPUT from '../../../input/INPUT.js';
import PROMPT from '../../../dialog/prompt/PROMPT.js';
import SPAN from '../../../span/SPAN.js';
/** Represents an INPUT element inside a group of form elements
    @class
    @extends FORMELEMENT
*/
export default class FORMPOSTINPUT extends FORMELEMENT {
	/** Constructs an INPUT element
	    @param {EL} node Parent
	    @param {MODEL} model The model
    */
	constructor(node, model) {
		super(node, 'DIV', model);
		this.inputGroup = new DIV(this.body.pane, new MODEL('input-group'));
		this.input = new INPUT(this.inputGroup, new MODEL(new ATTRIBUTES({
			class: 'form-control',
			name: this.attributes.name,
			value: this.attributes.value,
			type: this.attributes.type || 'TEXT',
			readonly: true
		})));
		this.form = null;
		this.createInput();
	}
	/** Creates an Input Group with an INPUT element inside of it
        @returns {void}
    */
    createInput() {
		if (this.attributes.type === 'HIDDEN') {
			this.collapse();
		}
		if (this.attributes.readonly) {
			this.input.el.setAttribute('readonly', 'readonly');
        }
        let className = this.input.el.form.className.value;
        let dataIdLabel = this.attributes.name;
        let formPostId = this.attributes.value;
        if (formPostId > 0) { //  || this.value > 0
			let btnEdit = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'EDIT1');
            btnEdit.el.onclick = () => this.createFormPostForm(className, dataIdLabel, formPostId);
		}
		let btnNew = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'NEW1');
        btnNew.el.onclick = () => this.createFormPostForm(className, dataIdLabel);

        let btnTest = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'TST1');
        btnTest.el.onclick = () => this.createFormPostFormTwo(className, dataIdLabel, formPostId, this.input);
	}
	/** Sets the id of the original FormPostInput to the given value
        @param {number} id Id to set
        @returns {void}
    */
	updateInput(id) {
		this.input.el.value = id;
	}
	/** Returns the default Input array
	    @param {object} data Payload
	    @returns {Array} An array of INPUT models
	*/
	defaultInputArray(data) {
		return [
			createInputModel('INPUT', 'id', data.model.id, 'ID', 'NUMBER', true),
			createInputModel('INPUT', 'shared', data.model.shared, 'shared', 'CHECKBOX')
		];
	}
    /** Generates the appropriate INPUT(s) for this FORMPOST
        @param {any} payload The FormPost Payload
        @param {string} className The container className
        @param {string} dataIdLabel The key (dataId, attributesId, descriptionId) to add object to
        @returns {Array<MODEL>} An array of MODEL inputs
    */
    generateInputs(payload, className, dataIdLabel) {
        let inputs = this.defaultInputArray(payload);
        this.input.el.setAttribute('value', payload.model.id); // Set INPUT element to model.id 
        switch (dataIdLabel) {
            case 'dataId':
                DATAELEMENTS[className].data.forEach((i) => inputs.push(i));
                break;
            case 'attributesId':
                DATAELEMENTS[className].attributes.forEach((i) => inputs.push(i));
                break;
            case 'descriptionId':
                inputs.push(createInputModel('TEXTAREA', 'description'));
                break;
            default:
                console.log('Unidentified attribute name', dataIdLabel);
        }
        return inputs;
    }
    /** Creates a FORM populated with the state of the given container
        @param {string} className The container className that the FormPost represents (ie: JUMBOTRON)
        @param {string} dataIdLabel The key (dataId, attributesId, descriptionId) to add object to
        @param {number} formPostId Optional FormPost Id to edit
        @returns {Promise<string>} Promise to create a new FormPost DIALOG and return its FORM
    */
    createFormPostForm(className, dataIdLabel, formPostId = 0) {
        return new Promise((resolve, reject) => {
            try {
                $.getJSON('/FORMPOST/GET/' + formPostId, (payload) => {
                    let inputs = this.generateInputs(payload, className, dataIdLabel);
                    try {
                        let dialog = new PROMPT(new MODEL().set({
                            label: 'Create FormPost Form',
                            inputs
                        }));
                        //dialog.container = container;
                        dialog.form.setId(3);
                        dialog.form.prompt = this;
                        dialog.form.setAction('FORMPOST/SET');

                        this.form = dialog.form;
                        if (payload.model.jsonResults) { // Set values based on existing 
                            JSON.parse(payload.model.jsonResults).forEach((inp) => {
                                this.form.el.elements[inp.name].value = inp.value;
                            });
                        }

                        dialog.form.afterSuccessfulPost = (result) => {
                            console.log('FORMPOSTINPUT.save() afterSuccessfulPost resolved', result);
                            dialog.close();
                        };

                        resolve(dialog.show());
                    } catch (e) {
                        reject(e);
                    }
                });
            } catch (e) {
                console.log(0, 'Unable to retrieve FormPost.', e);
                reject(e);
            }
        });
    }
    /** Creates a FORM populated with the state of the given container
        @param {string} className The container className that the FormPost represents (ie: JUMBOTRON)
        @param {string} dataIdLabel The key (dataId, attributesId, descriptionId) to add object to
        @param {number} formPostId Optional FormPost Id to edit
        @param {INPUT} inputNode The input that spawned this DIALOG
        @returns {Promise<string>} Promise to create a new FormPost DIALOG and return it
    */
    createFormPostFormTwo(className, dataIdLabel, formPostId = 0, inputNode = null) {
        return new Promise((resolve, reject) => {
            try {
                let dialog = new FORMPOSTFORM(new MODEL().set({
                    label: 'Create FormPost Form',
                    className,
                    dataIdLabel,
                    formPostId,
                    inputNode
                }));
                resolve(dialog.show());
            } catch (e) {
                reject(e);
            }
        });
    }
}
export { ATTRIBUTES, CONTAINER, EL, MODEL };