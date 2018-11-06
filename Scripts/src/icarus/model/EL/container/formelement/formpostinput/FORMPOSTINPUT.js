/** @module */
import FORMINPUT, { ATTRIBUTES, CONTAINER, EL, FORMELEMENT, MODEL } from '../../formelement/forminput/FORMINPUT.js';
//import CONTAINER from '../../CONTAINER.js';
import { DATAELEMENTS } from '../../../../../enums/DATAELEMENTS.js';
import DIALOG from '../../../dialog/DIALOG.js';
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
        console.log('FormPostInput', model, model.container);
		this.createInput(model.container);
	}
	/** Creates an Input Group with an INPUT element inside of it. 
        @param {CONTAINER} container The container
        @returns {void}
    */
    createInput(container) {
        console.log('CreateInput', container);
		this.inputGroup = new DIV(this.body.pane, new MODEL('input-group'));
		this.input = new INPUT(this.inputGroup, new MODEL(new ATTRIBUTES({
			class: 'form-control',
			name: this.attributes.name,
			value: this.attributes.value,
			type: this.attributes.type || 'text'
		})));
		this.form = null;
		if (this.attributes.value > 0 || this.value > 0) {
			this.btnEdit = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'EDIT1');
            this.btnEdit.el.onclick = () => this.editFormPost(); // .bind(this)
		}
		this.btnNew = new SPAN(this.inputGroup, new MODEL('input-group-addon'), 'NEW1');
        this.btnNew.el.onclick = () => {
            let className = this.input.el.form.className.value;
            console.log('THIS FORM', className);
            this.newAttributes(className, this.attributes.name, this);
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
			new MODEL(new ATTRIBUTES({
				name: 'shared',
                value: data.model.shared || 0,
                type: 'NUMBER'
            })).set({
                showNav: 0,
				element: 'INPUT',
				label: 'shared'
			}),
			new MODEL(new ATTRIBUTES({
				name: 'id',
                value: data.model.id,
                type: 'NUMBER'
            })).set({
                showNav: 0,
				element: 'INPUT',
				label: 'id'
            })
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
			for (let m = 0; m < model.length; m++) {
				inputs.push(model[m]);
			}
		} catch (e) {
			console.warn('No additional inputs exist for this form post', e);
		}
		return inputs;
	}
	/** Opens a Form within a dialog, populated with the state of the given container
        @param {CONTAINER} className The container who's state these attributes represent
        @param {string} dataIdLabel The key (dataId, attributesId, descriptionId) to add object to
        @param {MODEL} model Model 
        @returns {Promise<string>} Promise to create a new FormPost Object and retrieve its ID
    */
    newAttributes(className, dataIdLabel, model) {
        console.log('New Data Attributes Form', className, dataIdLabel, model, this);
        return new Promise((resolve, reject) => {
            console.log('newAttributes', className, dataIdLabel, model);
            try { // Generate new FormPost            
                $.getJSON('/FORMPOST/Get/0', (data) => {
                    let inputs = this.defaultInputArray(data);
                    this.input.el.setAttribute('value', data.model.id); // Set values in MODEL and DOM
                    
                    if (dataIdLabel === 'dataId') { // Append additional dataElements
                        inputs = this.appendAdditionalModelInputs(inputs, DATAELEMENTS[className]);
                    }

                    if (dataIdLabel === 'descriptionId') {
                        inputs.push(new MODEL(new ATTRIBUTES({
                            name: 'description',
                            type: 'text'
                        })).set({
                            element: 'TEXTAREA',
                            label: 'description'
                        }));
                    }
                    let dialog = this.createFormDialog(inputs); //data 
                    dialog.show();
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
        param {object} data Payload
        @returns {DIALOG} A Dialog with a form
    */
    createFormDialog(inputs) { //data
        let dialog = new DIALOG(new MODEL().set({
            label: 'Create FormPost Form'
        }));
        console.log('FORMPOSTINPUT: CreateForm(inputs)', inputs);
        dialog.form = FORM.createEmptyForm(dialog.body);
        dialog.form.id = 3; //console.log('formpostinput: 3');
        dialog.form.el.setAttribute('id', 3);
        dialog.form.prompt = this;
        //dialog.form.children[0].children[0].navBar.header.menu.getGroup('ELEMENTS').empty();
        //this.addFormElementGroupContainerCase(['INPUT', 'SELECT', 'TEXTAREA']);
        this.addInputs(inputs, dialog.form);
		//this.form.fieldset.formElementGroup.toggleHeaders();
        dialog.form.setPostUrl('FormPost/Set');
        dialog.form.afterSuccessfulPost = () => {
			this.successfulFormPost()
        };
        return dialog;
	}
	/** Creates an array of inputs that have been parsed
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
	/** Edits an existing FormPost
        param {ARRAY} inputArray Array of inputs
        @returns {void}
    */
	editFormPost() { // If given value is an integer, assume this is the FormPostId, otherwise, retrieve the formpost
        console.log('editFormPost()');
        let inputs = this.defaultInputArray(); /* [
			new MODEL(new ATTRIBUTES({
				'name': 'id',
				'value': this.input.attributes.value
			})).set({
				'element': 'INPUT',
				'type': 'FORMPOST',
				'label': 'id'
			})
		];*/
		try { // Test to see if the formpost can be retrieved
			$.getJSON('/FORMPOST/Get/' + this.input.attributes.value, (data) => { // If access granted...				
				if (data.model) {
					if (data.model.jsonResults) {
						inputs = this.createInputArrayHtmlDecoded(JSON.parse(data.model.jsonResults), inputs);
                        let dialog = this.createFormDialog(inputs); //data
                        dialog.show();
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
        @param {FORM} form A Form
        @todo Include other inputs such as SELECT and TEXTAREA
        @returns {void}
    */
	addInputs(inputs, form) {
		if (inputs) {
			for (let i = 0; i < inputs.length; i++) {
				let inp = null;
				if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].data.type === 'FORMPOSTINPUT' || inputs[i].attributes.type === 'FORMPOSTINPUT') {
					inp = new FORMPOSTINPUT(form.children[0].children[0].body.pane, inputs[i]);
				} else {
                    inp = new FORMINPUT(form.children[0].children[0].body.pane, inputs[i]);
				}
                form.children[0].children[0].children.push(inp);
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
                            let dialog = this.createFormPostForm(inputs, data);
                            dialog.show();
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
            label: 'Create FormPost Form'
        }));
        dialog.form = FORM.createEmptyForm(dialog.body);
        dialog.form.label = 'Modify';
        dialog.form.children[0].children[0].label = 'Attributes';
        dialog.form.children[0].children[0].navBar.header.menu.getGroup('ELEMENTS').empty(); // Empty out and populate with Form Elements only    
		this.addFormElementGroupContainerCase(['INPUT', 'SELECT', 'TEXTAREA']);
		this.addInputs(inputs, dialog.form);
        dialog.form.children[0].children[0].toggleHeaders(); // Show headers so that inputs can be modified
        dialog.form.setPostUrl('FormPost/Set');
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
		/*for (let i = 0; i < arr.length; i++) {
            this.form.children[0].children[0].addContainerCase(arr[i]);
		}*/
	}
}
export { ATTRIBUTES, CONTAINER, EL, MODEL };