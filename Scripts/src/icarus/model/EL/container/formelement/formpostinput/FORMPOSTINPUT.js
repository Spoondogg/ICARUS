/** @module */
import { DATAELEMENTS, createInputModel } from '../../../../../enums/DATAELEMENTS.js';
import FORMELEMENT, { ATTRIBUTES, CONTAINER, EL, MODEL } from '../../formelement/FORMELEMENT.js';
import DIV from '../../../div/DIV.js';
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
			this.body.collapse();
		}
		if (this.attributes.readonly) {
			this.input.el.setAttribute('readonly', 'readonly');
		}
		let className = this.input.el.form.className.value;
		let type = this.attributes.name;
		let id = this.attributes.value;
		if (id > 0) {
			let btnEdit = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'EDIT');
			btnEdit.el.onclick = () => this.createForm(className, type, id, this.input);
		}
		let btnNew = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'NEW');
		btnNew.el.onclick = () => this.createForm(className, type, 0, this.input);
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
	    @param {string} type The key (dataId, attributesId, descriptionId) to add object to
	    @returns {Array<MODEL>} An array of MODEL inputs
	*/
	generateInputs(payload, className, type) {
		let inputs = this.defaultInputArray(payload);
		this.input.el.setAttribute('value', payload.model.id); // Set INPUT element to model.id 
		switch (type) {
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
export { ATTRIBUTES, CONTAINER, EL, MODEL }