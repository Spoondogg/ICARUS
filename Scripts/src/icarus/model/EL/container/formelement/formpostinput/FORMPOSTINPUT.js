/** @module */
import { DATAELEMENTS, createInputModel } from '../../../../../enums/DATAELEMENTS.js';
import FORMINPUT, { ATTRIBUTES, CONTAINER, EL, FORMELEMENT, MODEL } from '../../formelement/forminput/FORMINPUT.js';
import DIALOG from '../../../dialog/DIALOG.js';
import DIV from '../../../div/DIV.js';
import FORM from '../../../form/FORM.js';
import INPUT from '../../../input/INPUT.js';
//import MODAL from '../../../modal/MODAL.js';
import SPAN from '../../../span/SPAN.js';
/** Represents an INPUT element inside a group of form elements    
    @description A FormPost Input acts as a special input that is populated
    with the Form Post Editor.
    The FormPostInput initially displays an individual INPUT, but can
    retrieve a secondary sub-form based on the input's value (aka: FormPost Id)
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
		if (this.attributes.value > 0) { //  || this.value > 0
			let btnEdit = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'EDIT1');
			btnEdit.el.onclick = () => this.editAttributes();
		}
		let btnNew = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'NEW1');
		btnNew.el.onclick = () => {
			let className = this.input.el.form.className.value;
			console.log('THIS FORM', className);
			this.newFormPost(className, this.attributes.name, this);
        }
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
	/** Append inputs from the given model
	    @param {Array} inputs An array of inputs
	    @param {Array} model An array of input models
	    @returns {Array} An array of inputs
        @see DATAELEMENTS DataElements contains arrays for each Container
	*/
	appendAdditionalModelInputs(inputs, model) {
        try { // Append any model inputs if they exist
            model.forEach((i) => inputs.push(i));
			//for (let m = 0; m < model.length; m++) {
			//	inputs.push(model[m]);
			//}
		} catch (e) {
			console.warn('No additional inputs exist for this form post', e);
		}
		return inputs;
	}
	/** Opens a Form within a dialog, populated with the state of the given container
        @param {string} className The container className
        @param {string} dataIdLabel The key (dataId, attributesId, descriptionId) to add object to
        @param {MODEL} model Model 
        @returns {Promise<string>} Promise to create a new FormPost Object and retrieve its ID
    */
	newFormPost(className, dataIdLabel, model) {
		console.log('New Data Attributes Form', className, dataIdLabel, model, this);
		return new Promise((resolve, reject) => {
            console.log('newFormPost', className, dataIdLabel, model);
			try { // Generate new FormPost            
				$.getJSON('/FORMPOST/Get/0', (data) => {
					let inputs = this.defaultInputArray(data);
					this.input.el.setAttribute('value', data.model.id); // Set values in MODEL and DOM
					console.warn('APPEND ME', data);
					if (dataIdLabel === 'dataId') { // Append additional dataElements
						inputs = this.appendAdditionalModelInputs(inputs, DATAELEMENTS[className].data);
                    }
                    if (dataIdLabel === 'attributesId') {
                        inputs = this.appendAdditionalModelInputs(inputs, DATAELEMENTS[className].attributes);
                    }
					if (dataIdLabel === 'descriptionId') {
						inputs.push(createInputModel('TEXTAREA', 'description'));
					}
					let dialog = this.createFormDialog(inputs, this.getContainer());
					//dialog.show();
					this.form = dialog.form;
					resolve(this.form);
				});
			} catch (e) {
				console.log(0, 'Unable to retrieve FormPost.', e);
				reject(e);
			}
		});
	}
	/** Executes on successful form post
        @param {object} data Json payload
        @param {CONTAINER} container This parent container
        @see https://developers.google.com/web/fundamentals/primers/promises
        @see https://scotch.io/tutorials/javascript-promises-for-dummies
        @see http://usejsdoc.org/tags-async.html
        @async
        @returns {Promise<boolean>} Returns true if Promise is resolved
    */
	successfulFormPost(data, container) {
		this.updateInput(data.model.id);
		/*
        let promise = new Promise((resolve) => { // reject
			container.save(true) //container, container, 
			resolve(true);
		});
		promise.then((result) => {
			//console.log('Promise success', result);
			let cc = container.getProtoTypeByClass('CONTAINER');
			if (cc !== null) {
				cc.refresh();
			}
			return result;
		}, (err) => {
			console.log('promise fail', err);
			return err; //console.log('promise fail', err);
		});
        */
		return container.save(true).then((result) => {
			let cc = container.getProtoTypeByClass('CONTAINER');
			if (cc !== null) {
				cc.refresh();
			}
			return result;
		}, (err) => {
			console.log('promise fail', err);
			return err;
		});
	}
	/** Constructs an empty FORM (id 3:formpost) and populates with given inputs
        @param {Array} inputs An array of inputs
        @param {CONTAINER} container Container
        @returns {DIALOG} A Dialog with a form
    */
	createFormDialog(inputs, container) { //data
		return new Promise((resolve, reject) => {
			try {
				let dialog = new DIALOG(new MODEL().set({
                    label: 'Create FormPost Form',
                    container
				}));
				console.log('FORMPOSTINPUT: CreateForm(inputs)', inputs);
				dialog.form = FORM.createEmptyForm(dialog.body);
				dialog.form.id = 3; //console.log('formpostinput: 3');
				dialog.form.el.setAttribute('id', 3);
				dialog.form.prompt = this;
				this.addInputs(inputs, dialog.form);
				dialog.form.setAction('FormPost/Set');
				dialog.form.afterSuccessfulPost = (payload) => {
					//this.successfulFormPost()
					console.log('FORMPOSTINPUT.save() afterSuccessfulPost resolved', payload);
					dialog.close();
				};
				//return dialog;
				resolve(dialog.show());
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Add the appropriate FORMELEMENT
        @param {Array} inputs An array of inputs
        @param {FORM} form A Form
        @todo Include other inputs such as SELECT and TEXTAREA
        @returns {void}
    */
	addInputs(inputs, form) {
		if (inputs) {
			for (let i = 0; i < inputs.length; i++) {
				let inp = null;
				switch (inputs[i].type) {
					case 'FORMPOSTINPUT':
						inp = new FORMPOSTINPUT(form.children[0].children[0].body.pane, inputs[i]);
						break;
					default:
						inp = new FORMINPUT(form.children[0].children[0].body.pane, inputs[i]);
				}
				form.children[0].children[0].children.push(inp);
			}
		}
	}
	/** Opens a Modal Form populated with an open version of the FormPost
        @returns {Promise} Promise to create an edit form for this object
    */
	editAttributes() {
		return new Promise(
			(resolve, reject) => {
				try { // Generate new FormPost            
					$.getJSON('/FORMPOST/Get/' + this.input.attributes.value, (data) => { // If access granted...
						if (data.model) {
							let inputs = this.defaultInputArray(data);
							this.input.el.setAttribute('value', data.model.id); // Set values in MODEL and DOM
							switch (this.attributes.name) {
								case 'dataId':
									inputs = this.appendAdditionalModelInputs(inputs, DATAELEMENTS[this.input.el.form.elements.className.value].data);
                                    break;
                                case 'attributesId':
                                    inputs = this.appendAdditionalModelInputs(inputs, DATAELEMENTS[this.input.el.form.elements.className.value].attributes);
                                    break;
								case 'descriptionId':
									inputs.push(createInputModel('TEXTAREA', 'description'));
									break;
								default:
									console.log('Unidentified attribute name', this.attributes.name);
							}
							if (data.model.jsonResults) { // loop through data.model and set values accordingly
								let i = 0;
								let jsonResults = JSON.parse(data.model.jsonResults);
								console.log('data.model', data.model);
								console.log('INPUTS', inputs);
								console.log('JSONRESULTS', jsonResults);
								jsonResults.forEach((inp) => {
									//console.log('INP[' + i + ']', inp);
									inputs[i].attributes.value = inp.value;
									i++;
								});
							} else {
								console.log('Json Results empty');
							}
                            let dialog = this.createFormDialog(inputs, this.getContainer());
							this.form = dialog.form;
							resolve(this.form);
						} else {
							reject(this.getMainContainer().login());
						}
					});
				} catch (e) {
					console.log(0, 'Unable to retrieve FormPost.', e);
					reject(e);
				}
			});
	}
	/** Iterates through the parsed json results and creates
	    a collection of INPUTS with associated parameters
	    Appends parsed inputs to the given INPUT array
	    @param {object} parsed A json object converted to an object
	    @param {CONTAINER} container This Container
	    @param {Array<MODEL>} inputs An array of inputs
	    @returns {Array<MODEL>} An array of input models
	*/
	createInputArray(parsed, container, inputs) {
		parsed.forEach(({ name, value }) => {
			//if (name !== 'id') {
			inputs.push(createInputModel('INPUT', name, this.getContainerProperty(container) || value));
			//}
		});
		return inputs;
	}
	/** Retrieves the set value of the given attribute from the form
	    @param {CONTAINER} container Container to assess
	    @param {string} name Parameter name
	    @returns {string} Parameter value
	*/
	getContainerProperty(container, name) {
		let param = container[name];
		let value = null;
		if (param) {
			if (param.el) {
				value = param.el.innerHTML;
			}
		}
		return value;
	}
	/** Attempts to destroy the form post form
	    @throws Throws an error if the form does not exist
	    @returns {ThisType} This for chaining
	*/
	destroyForm() {
		try {
			this.form.destroy();
		} catch (e) {
			console.warn('Unable to destroy pre-existing form', e);
		}
		return this;
	}
	/** Creates an empty form and populates with any given inputs
	    @param {Array} inputs An array of INPUTS
	    @param {object} data Payload for FORMPOST/Get
	    @returns {FORM} A form representing this form post
	*/
	createFormPostForm(inputs, data) {
		console.log('FORMPOSTINPUT.createFormPostForm()', inputs, data);
		let dialog = new DIALOG(new MODEL().set({
            label: 'Create FormPost Form',
            container: this.getMainContainer()
		}));
		dialog.form = FORM.createEmptyForm(dialog.body);
		dialog.form.label = 'Modify';
		dialog.form.children[0].children[0].label = 'Attributes';
		dialog.form.children[0].children[0].navBar.header.menu.getGroup('ELEMENTS').empty(); // Empty out and populate with Form Elements only    
		this.addFormElementGroupContainerCase(['INPUT', 'SELECT', 'TEXTAREA']);
		this.addInputs(inputs, dialog.form);
		dialog.form.children[0].children[0].toggleHeaders(); // Show headers so that inputs can be modified
		dialog.form.setAction('FormPost/Set');
		dialog.form.afterSuccessfulPost = () => { //console.log(100, 'Updated Attributes');            
			this.updateInput(data.model.id);
		};
		return dialog;
	}
	/** Adds a Container Case for each item in the list
	    @param {any} arr An array of INPUT Types (ie: INPUT, SELECT, TEXTAREA)
	    @returns {void}
	*/
	addFormElementGroupContainerCase(arr) {
		arr.forEach((c) => {
			this.form.children[0].children[0].addContainerCase(c);
		});
	}
}
export { ATTRIBUTES, CONTAINER, EL, MODEL };