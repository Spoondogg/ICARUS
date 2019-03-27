/** @module */
import { DATAELEMENTS, createInputModel } from '../../../../../enums/DATAELEMENTS.js';
import FORMELEMENT, { ATTRIBUTES, CONTAINER, Collapse, EL, Expand, LABEL, MODEL } from '../../formelement/FORMELEMENT.js';
import DIV from '../../../div/DIV.js';
import INPUT from '../../../input/INPUT.js';
import PROMPT from '../../../dialog/prompt/PROMPT.js';
import SPAN from '../../../span/SPAN.js';
/** Represents an INPUT element inside a group of form elements
    @class
    @extends FORMELEMENT
*/
export default class FORMPOSTINPUT extends FORMELEMENT {
	constructElements() {
        /** The input-group contains the input element
            @type {DIV}
        */
        this.inputGroup = new DIV(this.body.pane, new MODEL('input-group'));
        /** The primary INPUT Element for this FORMPOSTINPUT
            @type {INPUT}
        */
        this.input = new INPUT(this.inputGroup, new MODEL(new ATTRIBUTES({
			class: 'form-control',
			name: this.attributes.name,
			value: this.attributes.value,
			type: this.attributes.type || 'TEXT',
			readonly: true
        })));
        /** @type {FORM} */
		this.form = null;
		this.createInput();
	}
	/** Creates a Container/Group with an INPUT element inside of it
        @returns {void}
    */
    createInput() {
        //console.log(' - Creating INPUT', this);
        if (this.attributes.type === 'HIDDEN') {
            this.body.el.dispatchEvent(new Collapse(this.body));
        } else {
            this.body.el.dispatchEvent(new Expand(this.body));
        }
		if (this.attributes.readonly) {
			this.input.el.setAttribute('readonly', 'readonly');
		}
		let className = this.input.el.form.className.value;
		let type = this.attributes.name;
		let id = this.attributes.value;
		if (id > 0) {
			let btnEdit = new SPAN(this.inputGroup, new MODEL('input-group-addon').set('innerHTML', 'EDIT'));
			btnEdit.el.onclick = () => this.createForm(className, type, id, this.input);
		}
		let btnNew = new SPAN(this.inputGroup, new MODEL('input-group-addon').set('innerHTML', 'NEW'));
		btnNew.el.onclick = () => this.createForm(className, type, 0, this.input);
	}
	/* Sets the id of the original FormPostInput to the given value
        @param {number} id Id to set
        @returns {void}
    
	updateInput(id) {
		this.input.el.value = id;
	}*/
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
	    @param {string} type The key (dataId, attributesId, descriptionId) to add object to
	    @returns {Array<MODEL>} An array of MODEL inputs
	*/
	generateInputs(payload, className, type) {
		let inputs = this.defaultInputArray(payload);
		this.input.el.setAttribute('value', payload.model.id); // Set INPUT element to model.id 
        switch (type) {
            case 'dataId':
                DATAELEMENTS.get(className).data.forEach((i) => inputs.push(i));
				break;
			case 'attributesId':
                DATAELEMENTS.get(className).attributes.forEach((i) => inputs.push(i));
				break;
			case 'descriptionId':
				inputs.push(createInputModel('TEXTAREA', 'description'));
				break;
			default:
				console.log('Unidentified attribute name', type);
		}
		return inputs;
	}
	/** Creates a FORM that represents a given FORMPOST
	    @param {string} className The container className that the FormPost represents (ie: JUMBOTRON)
	    @param {string} type The key (dataId, attributesId, descriptionId) to add object to
	    @param {number} id Optional FormPost Id to edit
	    @param {INPUT} inputNode The input that spawned this DIALOG
	    @returns {Promise<string>} Promise to create a new FormPost DIALOG and return it
	*/
	createForm(className, type, id = 0, inputNode = null) {
		return new Promise((resolve, reject) => {
			try {
				let container = typeof this.container === 'undefined' ? this.getContainer().container : this.container;
				console.log('CreateForm', container, typeof container);
				new PROMPT(new MODEL().set({
					label: 'Create FormPost Form',
					container,
					caller: this
				})).createForm(new MODEL().set({
					formtype: 'FORMPOST',
					className,
					type,
					id,
					inputNode,
					container,
					caller: this
				})).then((form) => resolve(form.getDialog().show()));
			} catch (e) {
				console.warn('Failed to create FormPost Form', e, this);
				reject(e);
			}
		});
	}
}
export { ATTRIBUTES, CONTAINER, EL, LABEL, MODEL }