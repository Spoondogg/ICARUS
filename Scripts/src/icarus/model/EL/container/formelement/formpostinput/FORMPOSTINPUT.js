/** @module */
import FORMINPUT, { ATTRIBUTES, EL, FORMELEMENT, MODEL } from '../../formelement/forminput/FORMINPUT.js';
import CONTAINER from '../../CONTAINER.js';
import DIV from '../../../div/DIV.js';
import FORM from '../../../form/FORM.js';
import INPUT from '../../../input/INPUT.js';
import MODAL from '../../../modal/MODAL.js';
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
		this.createInput();
	}
	/** Creates an Input Group with an INPUT element inside of it. 
        @returns {void}
    */
	createInput() {
		this.inputGroup = new DIV(this.body.pane, new MODEL('input-group'));
		this.input = new INPUT(this.inputGroup, new MODEL(new ATTRIBUTES({
			'class': 'form-control',
			'name': this.attributes.name,
			'value': this.attributes.value,
			'type': this.attributes.type || 'text'
		})));
		this.form = null;
		if (this.attributes.value > 0 || this.value > 0) {
			this.btnEdit = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'EDIT1');
			this.btnEdit.el.onclick = this.editFormPost.bind(this);
		}
		this.btnNew = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'NEW1');
		this.btnNew.el.onclick = () => {
			this.newAttributes(this.getContainer(), this.attributes.name, this);
		};
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
			new MODEL(new ATTRIBUTES({
				'name': 'shared',
				'value': data.model.shared
			})).set({
				'element': 'INPUT',
				'label': 'shared',
				'value': '1'
			}),
			new MODEL(new ATTRIBUTES({
				'name': 'id',
				'value': data.model.id
			})).set({
				'element': 'INPUT',
				'label': 'id'
			})
		];
	}
	/** Append inputs from the given model
	    @param {Array} inputs An array of inputs
	    @param {Array} model An array of input models
	    @returns {Array} An array of inputs
	*/
	appendAdditionalModelInputs(inputs, model) {
		try { // Append any model inputs if they exist
			for (let m = 0; m < model.length; m++) {
				inputs.push(model[m]);
			}
		} catch (e) {
			console.warn('No additional inputs exist for this form post', e);
		}
		return inputs;
	}
	/** Opens a Modal Form populated with an open version of the FormPost
        @param {CONTAINER} container The container that this belongs to
        @param {string} dataIdLabel The key (dataId or attributesId) to add object to
        @param {MODEL} model Model
        @async
        return {Promise<string>}
        @returns {void}         
    */
	newAttributes(container, dataIdLabel, model) {
		try { // Generate new FormPost            
			$.getJSON('/FORMPOST/Get/0', (data) => {
				let inputs = this.defaultInputArray(data);
				this.appendAdditionalModelInputs(inputs, model.inputs);
				this.input.el.setAttribute('value', data.model.id); // Set values in MODEL and DOM
				container[dataIdLabel] = data.model.id;
				if (dataIdLabel === 'dataId') { // Append additional dataElements
					if (container.dataElements.length > 0) {
						this.appendAdditionalModelInputs(inputs, container.dataElements);
					}
				}
				if (dataIdLabel === 'descriptionId') {
					inputs.push(new MODEL(new ATTRIBUTES({
						'name': 'description',
						'type': 'text'
					})).set({
						'element': 'TEXTAREA',
						'label': 'description'
					}));
				}
				this.createForm(inputs); //data
			});
		} catch (e) {
			console.log(0, 'Unable to retrieve FormPost.', e);
		}
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
        let promise = new Promise((resolve) => { // reject
			//console.log('Promise: Saving parent form');
			//if (container.quickSave(container, true)) {
				//resolve('QuickSaved');
                container.save(container, container, true)
				resolve(true);
			//} else {
				//reject(Error('Failed to QuickSave'));
			//}
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
	}
	/**
		    Constructs an empty FORM (id 3:formpost) and populates
		    with given inputs
		    @param {Array} inputs An array of inputs
	        param {object} data Payload
		    @returns {void}
		*/
	createForm(inputs) { //data
		this.form = FORM.createEmptyForm(this.body.pane);
		this.form.id = 3; //console.log('formpostinput: 3');
		this.form.el.setAttribute('id', 3);
		this.form.prompt = this;
		this.form.fieldset.formElementGroup.navBar.header.menu.getGroup('ELEMENTS').empty();
		this.addFormElementGroupContainerCase(['INPUT', 'SELECT', 'TEXTAREA']);
		this.addInputs(inputs);
		//this.form.fieldset.formElementGroup.toggleHeaders();
		this.form.setPostUrl('FormPost/Set');
		this.form.afterSuccessfulPost = () => {
			this.successfulFormPost()
		};
	}
	/**
	    Creates an array of inputs that have been parsed
	    @param {any} parsed A parsed payload
	    @param {Array} inputs An array of inputs
	    @returns {Array} An array of inputs
	*/
	createInputArrayHtmlDecoded(parsed, inputs) {
		for (let i = 0; i < parsed.length; i++) {
			if (parsed[i].name !== 'id') {
				inputs.push(new MODEL(new ATTRIBUTES({
					'name': parsed[i].name,
					'value': this.htmlDecode(parsed[i].value) || ''
				})).set({
					'element': 'INPUT',
					'label': parsed[i].name
				}));
			}
		}
		return inputs;
	}
	/**
		    Edits an existing FormPost
		    param {ARRAY} inputArray Array of inputs
	        @returns {void}
		 */
	editFormPost() { // If given value is an integer, assume this is the FormPostId, otherwise, retrieve the formpost
		let inputs = [
			new MODEL(new ATTRIBUTES({
				'name': 'id',
				'value': this.input.attributes.value
			})).set({
				'element': 'INPUT',
				'type': 'FORMPOST',
				'label': 'id'
			})
		];
		try { // Test to see if the formpost can be retrieved
			$.getJSON('/FORMPOST/Get/' + this.input.attributes.value, (data) => { // If access granted...				
				if (data.model) {
					if (data.model.jsonResults) {
						inputs = this.createInputArrayHtmlDecoded(JSON.parse(data.model.jsonResults), inputs);
						this.createForm(inputs); //data
					} else {
						console.log('Json Results empty');
					}
				} else {
					this.prompt = new MODAL('Exception', data.message).show();
					this.getMainContainer().login();
				}
			});
		} catch (e) {
			console.log('Unable to retrieve FormPost.', e);
		}
	}
	/** Add the appropriate FORMELEMENT
        @param {Array} inputs An array of inputs
        @todo Include other inputs such as SELECT and TEXTAREA
        @returns {void}
    */
	addInputs(inputs) {
		if (inputs) {
			for (let i = 0; i < inputs.length; i++) {
				let inp = null;
				if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].data.type === 'FORMPOSTINPUT' || inputs[i].attributes.type === 'FORMPOSTINPUT') {
					inp = new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
				} else {
					inp = new FORMINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
				}
				this.form.fieldset.formElementGroup.children.push(inp);
			}
		}
	}
	/** Opens a Modal Form populated with an open version of the FormPost
        @returns {void}
        @todo This is just ridiculously long and needs to be cleaned up
    */
	editAttributes() {
		console.log('editattributes');
		let id = parseInt(this.input.attributes.value);
		let inputs = [
			new MODEL(new ATTRIBUTES({
				'name': 'id',
				'value': id
			})).set({
				'element': 'INPUT',
				'type': 'FORMPOST',
				'label': 'id'
			})
		];
		// Test to see if the formpost can be retrieved
		try {
			$.getJSON('/FORMPOST/Get/' + id, (data) => {
				if (data.model) { // If access granted...
					if (data.model.jsonResults) {
						if (typeof container === 'undefined') {
							console.log('Unable to retrieve parent container');
						} else {
							inputs = this.createInputArray(JSON.parse(data.model.jsonResults), this.getContainer(), inputs);
							this.destroyForm();
							this.createFormPostForm(inputs, data);
						}
					}
				} else {
					console.log(0, 'An Exception Occurred', data.message);
					this.getMainContainer().login();
				}
			});
		} catch (e) {
			console.log(0, 'Unable to retrieve FormPost.', e);
		}
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
		/*for (let i = 0; i < parsed.length; i++) {
			let inp = parsed[i];
			if (inp.name !== 'id') {
				let value = null;
				if (container[inp.name]) {
					if (container[inp.name].el) {
						value = container[inp.name].el.innerHTML;
					}
				} else {
					value = inp.value;
				}
				inputs.push(new MODEL(new ATTRIBUTES({
					'name': inp.name,
					value //inp.value
				})).set({
					'element': 'INPUT',
					'label': inp.name
				}));
			}
        }*/
		parsed.forEach(({ name, value }) => {
			if (name !== 'id') {
				inputs.push(new MODEL(new ATTRIBUTES({
					name,
					'value': this.getContainerProperty(container) || value
				})).set({
					'element': 'INPUT',
					'label': name
				}));
			}
		});
		return inputs;
	}
	/**
	    Retrieves the set value of the given attribute from the form
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
	/**
	    Attempts to destroy the form post form
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
	/**
	    Creates an empty form and populates with any given inputs
	    @param {Array} inputs An array of INPUTS
	    @param {object} data Payload for FORMPOST/Get
	    @returns {FORM} A form representing this form post
	*/
	createFormPostForm(inputs, data) {
		this.form = FORM.createEmptyForm();
		this.form.label = 'Modify';
		this.form.fieldset.formElementGroup.label = 'Attributes';
		this.form.fieldset.formElementGroup.navBar.header.menu.getGroup('ELEMENTS').empty(); // Empty out and populate with Form Elements only    
		this.addFormElementGroupContainerCase(['INPUT', 'SELECT', 'TEXTAREA']);
		this.addInputs(inputs);
		this.form.fieldset.formElementGroup.toggleHeaders(); // Show headers so that inputs can be modified
		this.form.setPostUrl('FormPost/Set');
		this.form.afterSuccessfulPost = () => { //console.log(100, 'Updated Attributes');            
			this.updateInput(data.model.id);
		};
		return this.form;
	}
	/**
	    Adds a Container Case for each item in the list
	    @param {any} arr An array of INPUT Types (ie: INPUT, SELECT, TEXTAREA)
	    @returns {void}
	*/
	addFormElementGroupContainerCase(arr) {
		for (let i = 0; i < arr.length; i++) {
			this.form.fieldset.formElementGroup.addContainerCase(arr[i]);
		}
	}
}
export { ATTRIBUTES, CONTAINER, EL, MODEL };