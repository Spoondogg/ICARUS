/* eslint-disable max-lines */
/** @module */
import CONTAINER, {
	ATTRIBUTES,
	AbstractMethodError,
	EL,
	ICONS,
	INPUTTYPES,
	MODEL
} from '../container/CONTAINER.js';
import {
	DATAELEMENTS,
	createInputModel
} from '../../../enums/DATAELEMENTS.js';
import {
	ALIGN
} from '../../../enums/ALIGN.js';
import FIELDSET from '../fieldset/FIELDSET.js';
import FORMFOOTER from './FORMFOOTER.js';
import FORMINPUT from '../container/formelement/forminput/FORMINPUT.js';
import FORMINPUTTOKEN from '../container/formelement/forminput/forminputtoken/FORMINPUTTOKEN.js';
import FORMPOST from './FORMPOST.js';
import FORMPOSTINPUT from '../container/formelement/formpostinput/FORMPOSTINPUT.js';
import FORMSELECT from '../container/formelement/formselect/FORMSELECT.js';
import FORMTEXTAREA from '../container/formelement/formtextarea/FORMTEXTAREA.js';
import LOADER from '../dialog/loader/LOADER.js';
/** A FORM is the underlying form data type for all other page constructors
    and is designed to submit an XML object for Object States.
    @class
    @extends CONTAINER
*/
export default class FORM extends CONTAINER {
	/** Constructs a Form for collecting and posting
	    @param {CONTAINER} node The parent object
	    @param {MODEL} model The object model
	*/
	constructor(node, model) {
		super(node, 'FORM', model, ['TEXTBLOCK', 'JUMBOTRON', 'FIELDSET']);
		//this.addCase('FIELDSET', () => this.addFieldset(model));
		this.createEditableElement('header', this.body.pane).then((header) => $(header.el).insertBefore(this.body.pane.el));
		this.tokenInput = new FORMINPUTTOKEN(this); //, new MODEL().set({ 'value': this.getToken() })
		this.footer = new FORMFOOTER(this.body, new MODEL().set('align', ALIGN.VERTICAL));
		this.footer.buttonGroup.addButton('Submit', ICONS.SAVE, 'SUBMIT').el.onclick = (e) => {
			e.preventDefault();
			this.post();
			return false;
		};
		//this.populate(model.children);
		// Set focused container for relevant keyBindings
		this.el.addEventListener('focusin', () => this.setFocus('focusin'));
        this.el.addEventListener('focusout', () => this.setFocus('focusout'));

        /*
        let { menu } = this.navbar.options; // .get('CRUD', 'MENU')[0]
        this.btnPost = menu.addNavItemIcon(new MODEL().set({
            icon: ICONS.SAVE,
            label: 'SAVE'
        }));
        this.btnPost.el.addEventListener('click', (ev) => {
            ev.preventDefault();
            this.post();
            return false;
        });
        this.btnPost.el.addEventListener('mouseup', () => menu.el.dispatchEvent(new Deactivate()));
        //this.btnPost.el.addEventListener('mouseup', () => this.closeMenus(group));
        */
	}
	/** Perform any async actions and populate this Container
	    @param {Array<MODEL>} children Array of elements to add to this container's body
	    @returns {Promise<ThisType>} callback
	*/
	construct(children) {
		return this.populate(children).then(() => this.ifEmpty());
	}
	/** Sets the focused container to this FORM to listen for appropriate key bindings
	    @param {string} eventName Name of event
	    @returns {void}
	*/
	setFocus(eventName) {
		try {
			this.getContainer().getMain().activeContainer = eventName === 'focusin' ? this : null;
		} catch (e) {
			console.log('Unable to modify focus for this form', this);
		}
	}
	/** Constructs a Fieldset for this FORM
	    @param {MODEL} model Object model
	    @returns {FIELDSET} A Form Fieldset element
	*/
	addFieldset(model) {
		return this.addChild(new FIELDSET(this.body.pane, model));
	}
	/** Populates this form with a single fieldset and formelementgroup based on a FORMPOST MODEL
	    @param {EL} node Parent node
        @param {MODEL} model Model
	    @returns {FORM} An empty form container
	*/
	static createFormPostForm(node, model) {
		let {
			className,
			type,
			hidden,
			id
		} = model; // Consider and verify
		return new Promise((resolve, reject) => {
			FORM.createEmptyForm(node, hidden).then((form) => {
				form.setAction('FORMPOST/SET');
				try { // frm.setId(payload.model.id);
					$.getJSON('/FORMPOST/GET/' + id, (payload) => form.addInputs(form.generateFormPostInputs(payload, className, type), form.children[0].children[0]).then(() => {
						if (payload.model.jsonResults) { // Set values based on existing 
							JSON.parse(payload.model.jsonResults).forEach((inp) => {
								form.el.elements[inp.name].value = inp.value;
							});
						}
						form.afterSuccessfulPost = () => form.getDialog().close();
						if (model.inputNode) {
							model.inputNode.el.setAttribute('value', form.el.elements.id.value);
						}
						resolve(form);
					}));
				} catch (e) {
					reject(e);
				}
			});
		});
	}
	/** Constructs a FORM based on a CONTAINER with a single fieldset and formelementgroup
        based on a FORMPOST MODEL
	    @param {EL} node Parent node
        @param {MODEL} model Model
	    @returns {Promise<FORM>} An empty form container
	*/
	static createContainerForm(node, model) {
		return new Promise((resolve, reject) => {
			try {
				FORM.createEmptyForm(node, model.hidden).then((frm) => {
					frm.setAction(model.container.className + '/SET').addInputs(model.container.createContainerInputs()).then((f) => {
						f.afterSuccessfulPost = () => f.getDialog().close();
						resolve(f);
					});
				});
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Adds the provided buttons to the prompt
	    @param {Array<BUTTON>} buttons An array of buttons ([label, glyphicon, buttonType])
	    @returns {Promise<ThisType>} callback
	*/
	addButtons(buttons) {
		return new Promise((resolve) => {
			if (buttons) {
				buttons.forEach((btn) => this.footer.buttonGroup.addButton(btn[0], btn[1], btn[2]));
			}
			resolve(this);
		});
	}
	/** Adds the provided inputs to the FORM asynchronously
	    @param {Array<MODEL>} inputs An array of inputs
        @param {CONTAINER} target Target node
	    @returns {Promise<ThisType>} callback
	*/
	addInputs(inputs = [], target = this) {
		return new Promise((resolve) => {
			if (inputs) {
				Promise.all(inputs.map((i) => this.addInput(i, target))).then(() => resolve(this));
			}
			resolve(this);
		});
	}
	/** Adds the input to the FORM 
	    @param {MODEL} input An input model
	    @param {CONTAINER} target Target node
	    @returns {Promise<FORMELEMENT>} Newly created Form Element
	*/
	addInput(input, target = this) {
		return new Promise((resolve, reject) => {
			try {
				let inp = null;
				if (input.type === 'FORMPOSTINPUT') {
					inp = new FORMPOSTINPUT(target.body.pane, input);
				} else {
					switch (input.element) {
						case 'TEXTAREA':
							inp = new FORMTEXTAREA(target.body.pane, input);
							break;
						case 'SELECT':
							inp = new FORMSELECT(target.body.pane, input);
							break;
						case 'INPUT':
							inp = new FORMINPUT(target.body.pane, input);
							break;
						default:
							inp = new FORMINPUT(target.body.pane, input);
							break;
					}
				}
				target.children.push(inp);
				resolve(inp);
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Returns the default Input array
	    @param {object} data Payload
	    @returns {Array} An array of INPUT models
	*/
	defaultFormPostInputArray(data) {
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
	generateFormPostInputs(payload, className, type) {
		let inputs = this.defaultFormPostInputArray(payload);
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
	/** Populates this form with a single fieldset and formelementgroup
        NavBars are hidden for these elements
	    @param {EL} node Parent node
	    @param {boolean} hidden If true, form is hidden
	    @returns {Promise<FORM>} An empty form container
	*/
	static createEmptyForm(node, hidden = false) {
		return new Promise((resolve, reject) => {
			try {
				let form = new FORM(node, new MODEL(new ATTRIBUTES('style', hidden ? 'display:none;' : '')).set('showNav', 0));
				form.addFieldset(new MODEL().set('showNav', 0)).addFormElementGroup(new MODEL().set('showNav', 0));
				resolve(form);
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Sets this form's ACTION attribute
        @param {string} url Target url
        @returns {ThisType} Returns this form
    */
	setAction(url = 'FORM/SUBMIT') {
		this.attributes.action = url;
		this.el.setAttribute('action', url);
		return this;
	}
	/** Sets the form method
	    @param {string} method ie POST or GET
	    @returns {ThisType} callback
	*/
	setMethod(method = 'POST') {
		this.attributes.method = method;
		this.el.setAttribute('method', method);
		return this;
	}
	/** Gets this form's ACTION attribute
	    @returns {string} Returns this form's action
	*/
	getAction() {
		return this.attributes.action || 'FORM/SUBMIT';
	}
	/** Returns the form's respective DIALOG container (if exists)
	    @returns {Promise<DIALOG>} A DIALOG
	*/
	getDialog() {
		return Promise.reject(new AbstractMethodError('No DIALOG exists for this FORM', this));
	}
	/** Disables all fieldsets within this form
        @todo Should be Promise.all
	    @returns {boolean} Returns true if successful
	*/
	lock() {
		this.children.forEach((i) => {
			try {
				switch (i.className) {
					case 'FIELDSET':
						break;
					default:
						i.el.disabled = true;
						//console.log('Locked element', i);
						break;
				}
			} catch (e) {
				if (e instanceof TypeError) {
					console.warn('Unable to lock ', i, e);
				} else {
					throw e;
				}
			}
		});
		return true;
	}
	/** Enables all fieldsets within this form
	    @returns {Promise<ThisType>} callback
	*/
	unlock() {
		return new Promise((resolve, reject) => {
			this.children.forEach((i) => {
				try {
					switch (i.className) {
						case 'FIELDSET':
							break;
						default:
							i.el.disabled = false;
							break;
					}
				} catch (e) {
					if (e instanceof TypeError) {
						console.warn('Unable to unlock "' + i.element + '"');
					} else {
						reject(e);
					}
				}
			});
			resolve(this);
		});
	}
	/** HTML encodes all form element values
	    @returns {void}
	*/
	htmlEncodeValues() {
		try {
			for (let e = 0; e < this.el.elements.length; e++) {
				let type = this.el.elements[e].type.toUpperCase();
				switch (type) {
					case 'TEXT':
					case 'TEXTAREA':
						this.el.elements[e].value = this.htmlEncode(this.el.elements[e].value);
						break;
					case 'FIELDSET':
					case 'NUMBER':
					case 'CHECKBOX':
					case 'HIDDEN':
					case 'SUBMIT':
						break;
					default:
						console.warn('Unrecognized type', type);
				}
			}
		} catch (e) {
			console.log('FORM.htmlEncodeValues() failed.');
			throw e;
		}
	}
	/** Flags the given element as invalid 
		@param {any} element The form element
	    @returns {boolean} Returns false;
	*/
	setInvalid(element) {
		this.payload.isValid = false;
		element.focus();
		element.setAttribute('data-valid', this.payload.isValid);
		console.log(element.name + ' is invalid', element);
		$(element.previousSibling).addClass('invalid'); // Set label class to 'invalid'
		return false;
	}
	/** Flags the given element as valid 
		@param {any} element The form element
	    @returns {boolean} Returns true
	*/
	setValid(element) {
		$(element).removeClass('invalid');
		element.setAttribute('data-valid', this.payload.isValid);
		return true;
	}
	/** Validates the given element as a STRING using HTML5 validation
	    @param {HTMLElement} element The Input element
	    @returns {boolean} True if valid
	*/
	validateString(element) {
		let isValid = true;
		if (element.checkValidity()) {
			isValid = element.value === '' ? this.setInvalid(element) : this.setValid(element);
		}
		return isValid;
	}
	/** Simple number validation
	    @param {HTMLElement} element The Input element
	    @returns {boolean} True if valid
	*/
	validateNumber(element) {
		return element.checkValidity() ? this.setValid(element) : this.setInvalid(element);
	}
	/** Simple SELECT validation
	    @param {HTMLElement} element The Input element
	    @returns {boolean} True if valid
	*/
	validateSelect(element) {
		return element.selectedIndex > 0 ? this.setValid(element) : this.setInvalid(element);
	}
	/** Simple CHECKBOX validation
	    @param {HTMLElement} element The Input element
	    @returns {boolean} True if valid
	*/
	validateCheckbox(element) {
		if (element.required) {
			return element.checked ? this.setValid(element) : this.setInvalid(element);
		}
	}
	/** Validate the current form and return true if form is valid
	    Note that this is a simple form of validation that occurs on the
	    client side and should not be used as a substitution for
	    server side validation.
        For loop outperforms forEach because of break
        @see https://thejsguy.com/2016/07/30/javascript-for-loop-vs-array-foreach.html
	    @returns {object} The validation payload
	*/
	validate() {
		this.htmlEncodeValues();
		this.payload = {
			isValid: true,
			formName: this.el.name
		};
		for (let e = 0; e < this.el.elements.length; e++) {
			let element = this.el.elements[e];
			switch (element.type) {
				case 'hidden':
				case 'input':
				case 'text':
				case 'email':
				case 'tel':
				case 'password':
				case 'textarea':
					this.validateString(element);
					break;
				case 'number':
					this.validateNumber(element, this.payload);
					break;
				case 'checkbox':
					this.validateCheckbox(element, this.payload);
					break;
				case 'select-one':
					this.validateSelect(element, this.payload);
					break;
				case 'fieldset':
				case 'submit':
					break;
				default:
					console.warn('Unable to validate unidentified form element type.', element.type, element.value);
			}
		}
		if (!this.payload.isValid) {
			console.log('Validation Result: ' + this.payload.isValid);
		}
		return this.payload;
	}
	/** Resets the form and any validation notifications.
        @returns {void}
	*/
	reset() {
		//console.log('Resetting form[' + this.el.name + ']');
		this.el.elements.forEach((e) => {
			e.removeAttribute('data-valid');
			$(e.previousSibling).removeClass('invalid');
		});
		this.el.reset();
	}
	/** Serialize the form into an array
	    @returns {array} Form Results as an Array of key/value pairs
	*/
	getResultsAsArray() {
		//console.log('FORM.getResultsAsArray()', $(this.el).serializeArray());
		return $(this.el).serializeArray();
	}
	/** If valid, Returns a FormPost based on values in this form
	    @returns {FormPost} A FormPost Object
	*/
	getFormPost() {
		return this.validate().isValid ? new FORMPOST(this) : null;
	}
	/* eslint-disable max-lines-per-function */
	/** Post FORM values to server
	    @returns {Promise<object>} The results of the Form Post
	*/
	post() {
		return new Promise((resolve, reject) => {
			/** @type {CONTAINER} */
			//let main = this.getMain();
			let main = null;
			try {
				main = this.getContainer().getMain();
			} catch (e) {
				main = this.getDialog().getContainer().getMain();
			}
			/** @type {LOADER} */
			let loader = main.getLoader();
			let data = this.getFormPost();
			let url = this.getAction();
			let statusCode = 0;
			let message = '';
			if (data) {
				try {
					loader.log(10, 'Posting values to ' + this.getAction(), true).then(() => {
						this.lock();
						$.ajax({
							url,
							type: 'POST',
							data,
							error(xhr, statusText, errorThrown) {
								console.warn('An Unknown Error Occurred');
								loader.log(100, 'Ajax Error: ' + statusText + '(' + xhr.status + ') Error: ' + errorThrown, true, 0);
							},
							statusCode: {
								200(response) {
									statusCode = 200;
									message += response.message;
									//console.log(100, 'StatusCode: 200, ' + response.message, true).then(() => main.login());
								},
								201(response) {
									statusCode = 201;
									message += response.message;
									//loader.log(100, 'StatusCode: 201, ' + response.message, true);
								},
								400(response) {
									statusCode = 400;
									message += response.message;
									//loader.log(100, 'StatusCode: 400, ' + response.message, true);
								},
								403(response) { // Forbidden
									statusCode = 403;
									message += response.message;
									loader.log(100, 'StatusCode: ' + statusCode + ', "' + url + '" Access Denied. Log in to continue. ' + response.message, true, 0).then(() => {
										//console.log('403 Error', response);
										resolve(main.login());
									});
								},
								404(response) {
									statusCode = 404;
									message += response.message;
								}
							},
							success: (payload) => {
								loader.log(100, 'StatusCode: ' + statusCode + '\n' + message, true).then(() => {
									console.log('Payload Result: ' + payload.result);
									if (payload.result === 0) {
										main.login();
									}
								});
								this.unlock();
								this.afterSuccessfulPost(payload);
								resolve(payload);
							}
						});
					});
				} catch (e) {
					loader.log(100, 'Post Failed to submit', true, 5000).then(() => reject(new Error('Post Failed to submit')));
				}
			} else {
				loader.log(100, 'Invalid FormPost', true, 5000).then(() => reject(new Error('Invalid FormPost')));
			}
		});
	}
	/* eslint-enable max-lines-per-function */
}
export {
	ATTRIBUTES,
	EL,
	FORMFOOTER,
	FORMINPUT,
	FORMPOST,
	INPUTTYPES,
	LOADER,
	MODEL
};
/* eslint-enable max-lines */