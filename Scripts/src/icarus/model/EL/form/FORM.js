/* eslint-disable max-lines */
/** @module */
import CONTAINER, { ATTRIBUTES, AbstractMethodError, EL, ICONS, INPUTTYPES, MODEL } from '../container/CONTAINER.js';
import { DATAELEMENTS, createInputModel } from '../../../enums/DATAELEMENTS.js';
import FORMELEMENTGROUP, { FORMELEMENT, FORMINPUT, FORMPOSTINPUT, FORMSELECT, FORMTEXTAREA } from '../container/formelement/FORMELEMENTGROUP.js';
import FORMFOOTER, { BUTTON, BUTTONGROUP } from './FORMFOOTER.js';
import { ALIGN } from '../../../enums/ALIGN.js';
import FIELDSET from '../fieldset/FIELDSET.js';
import FORMINPUTTOKEN from '../container/formelement/forminput/forminputtoken/FORMINPUTTOKEN.js';
import FORMPOST from './FORMPOST.js';
import LOADER from '../dialog/loader/LOADER.js';
/** A FORM is the underlying form data type for all other page constructors
    and is designed to submit an XML object for Object States.
    @class
    @extends CONTAINER
*/
export default class FORM extends CONTAINER {
	/** Constructs a Form for collecting and posting
	    @param {CONTAINER} node The parent object
	    @param {FORMMODEL} model The object model
	*/
	constructor(node, model) {
		super(node, 'FORM', model, DATAELEMENTS.get('FORM').containers);
		this.addClass('form');
		this.tokenInput = new FORMINPUTTOKEN(this);
		this.footer = new FORMFOOTER(this.body, new MODEL().set('align', ALIGN.VERTICAL));
		this.footer.buttonGroup.addButton('Submit', ICONS.SAVE, 'SUBMIT').el.onclick = (e) => {
			e.preventDefault();
			this.post();
			return false;
		};
		// Set focused container for relevant keyBindings
		this.el.addEventListener('focusin', () => this.setFocus('focusin'));
		this.el.addEventListener('focusout', () => this.setFocus('focusout'));
    }
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('header', this.body.pane);
                this.createEditableElement('p', this.body.pane);
            } else {
                this.ifEmpty();
            }
        });
    }
    /** Constructs a Fieldset for this FORM
	    @param {MODEL} model Object model
	    @returns {FIELDSET} A Form Fieldset element
	*/
	addFieldset(model) {
		return this.addChild(new FIELDSET(this.body.pane, model));
    }
    /** Returns an array of FIELDSET(s), optionally filtered to the specified name
        @param {string} [name] Optional name to filter search
        @returns {Array<FIELDSET>} An array of FIELDSET(s)
    */
    getFieldset(name = null) {
        return this.get(name, 'FIELDSET');
    }
	/** Adds a single FIELDSET and FORMELEMENTGROUP as children of this FORM and
        populates based on the given FORMPOST MODEL
        @description This is a description
	    @param {EL} node Parent node
        @param {FormPostFormModel} model Model
	    @returns {Promise<FORM>} An empty form container
	*/
    static createFormPostForm(node, model) {
        console.log('FORM.createFormPostForm()', model);
        /** @type {{className:string, type:string, hidden:boolean, id:number}} */
		let {
			className,
			type,
			hidden,
			id
		} = model;
        return new Promise((resolve, reject) => FORM.createEmptyForm(node, hidden).then((form) => {
            form.setAction('FORMPOST/SET');
            try {
                form.getPayload(id).then((payload) => {
                    let inputs = form.generateFormPostInputs(payload, className, type);
                    console.log('inputs', inputs);                    
                    form.getFieldset()[0].getFormElementGroup()[0].addInputElements(inputs).then(() => {
                        if (payload.model.jsonResults) { // Set values based on existing 
                            JSON.parse(payload.model.jsonResults).forEach((inp) => form.setTextInputValue(inp));
                        }
                        form.afterSuccessfulPost = () => form.getDialog().close();
                        if (model.inputNode) {
                            model.inputNode.el.setAttribute('value', form.el.elements.id.value);
                        }
                        resolve(form);
                    });
                });
            } catch (e) {
                reject(e);
            }
        }));
	}
	/** Attempts to set any child input elements of this form by name to given value
	    @param {NameValuePair} inp Input Object/Model
	    @returns {void}
	*/
	setTextInputValue(inp) {
		let { name, value } = inp;
		try {
			if (this.el.elements[name].type === 'textarea') {
				this.el.elements[name].innerHTML = value;
			} else {
				this.el.elements[name].setAttribute('value', value);
			}
		} catch (e) {
			if (!(e instanceof TypeError)) {
				console.warn(this.toString() + '.setTextInputValue() Unable to set value of ' + name + ' to ' + value, inp, this.el.elements);
				throw e;
			}
		}
	}
	/** Constructs a FORM based on a CONTAINER with a single fieldset and formelementgroup
        based on a FORMPOST MODEL
	    @param {EL} node Parent node
        @param {FormModel} model Model
	    @returns {Promise<FORM>} An empty form container
	*/
    static createContainerForm(node, model) {
		return new Promise((resolve, reject) => {
			try {
                FORM.createEmptyForm(node, model.hidden).then((frm) => {
                    let inputs = model.container.createContainerInputs();
                    let [target] = frm.getFieldset()[0].getFormElementGroup();
                    frm.setAction(model.container.className + '/SET');
                    target.addInputElements(inputs).then(() => {
						frm.afterSuccessfulPost = () => frm.getDialog().close();
						resolve(frm);
					});
				});
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Adds the provided buttons to the prompt
	    @param {Array<BUTTON>} buttons An array of buttons ([label, glyphicon, buttonType])
	    @returns {Promise<ThisType>} Promise Chain
	*/
	addButtons(buttons) {
		return new Promise((resolve) => {
			if (buttons) {
				buttons.forEach((btn) => this.footer.buttonGroup.addButton(btn[0], btn[1], btn[2]));
			}
			resolve(this);
		});
    }
    /** Actions performed after this CONTAINER is saved.
        @description Typically, the form should be hidden or replaced with some sort of SUCCESS notification
        @param {Payload} payload Form Response Payload
        @returns {void}
    */
    afterSuccessfulPost(payload) {
        console.log(100, 'Post Results', payload);
        /** An array of form elements (fieldsets, buttons etc) that can be disabled
            @type {Array<EL>} Collection of Form Elements
        */
        let toDisable = this.footer.buttonGroup.get();
        this.getFieldset().forEach((fs) => toDisable.push(fs));
        toDisable.forEach((el) => el.setAttribute('disabled', 'disabled'));

        /** A button that restores functionality of the form */
        let btnReset = this.footer.buttonGroup.addButton('Reset Form', ICONS.RESET); 
        btnReset.el.onclick = () => {
            toDisable.forEach((el) => el.removeAttribute('disabled'));
            btnReset.destroy();
        }
    }
    /** Creates a new form post
        @param {string} type ie: data, meta, attributes
        @returns {void}
    */
    createNewFormPost(type) {
        try {
            let typeId = type + 'Id';
            let [fs] = this.getFieldset();
            let [fsg] = fs.getFormElementGroup();
            let formPostInput = fsg.get(null, 'FORMPOSTINPUT'); //typeId, 'FORMPOSTINPUT'
            let [formPostInputType] = formPostInput.filter((inp) => inp.attributes.name === typeId);
            formPostInputType.createForm(this.className, type, 0, formPostInputType.input);
        } catch (e) {
            console.warn(this.toString() + ' is unable to create a new FORMPOST for ' + type)
        }
    }
	/** Returns the default Input array
	    @param {object} data Payload
	    @returns {Array} An array of INPUT models
	*/
	defaultFormPostInputArray(data) {
		return [
			createInputModel('INPUT', 'id', data.model.id, 'ID', 'NUMBER', true),
            createInputModel('INPUT', 'shared', data.model.shared, 'shared', 'CHECKBOX'),
            createInputModel('INPUT', 'isPublic', data.model.isPublic, 'isPublic', 'CHECKBOX')
		];
	}
	/** Generates the appropriate INPUT(s) for this FORMPOST
        @param {any} payload The FormPost Payload
	    @param {string} className The container className
	    @param {string} type The key (dataId, attributesId, metaId) to add object to
	    @returns {Array<MODEL>} An array of MODEL inputs
	*/
    generateFormPostInputs(payload, className, type) { // SEE CONTAINER.createElementCollection
        let inputs = this.defaultFormPostInputArray(payload);
		try {
			DATAELEMENTS.get('CONTAINER')[type].forEach((i) => inputs.push(i));
		} catch (e) {
			//console.warn(this.toString() + '.generateFormPostInputs()', className, type, inputs, e);
		}
		try {
			DATAELEMENTS.get(className)[type].forEach((i) => inputs.push(i));
		} catch (e) {
			// No data element exists for 'className'
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
        console.log('FORM.createEmptyForm()');
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
        @returns {FORM} Returns this form
    */
	setAction(url = 'FORM/SUBMIT') {
		this.attributes.action = url;
		this.el.setAttribute('action', url);
		return this;
	}
	/** Sets the form method
	    @param {string} method ie POST or GET
	    @returns {ThisType} Method Chain
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
	    @returns {Promise<ThisType>} Promise Chain
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
                    case 'EMAIL':
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
			console.log(this.toString() + '.htmlEncodeValues() failed.');
			throw e;
		}
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
	/** Flags the given element as invalid 
		@param {any} element The form element
	    @returns {boolean} Returns false;
	*/
	setInvalid(element) {
		this.payload.isValid = false;
		element.focus();
		element.setAttribute('data-valid', this.payload.isValid);
		console.log(element.name + ' is invalid', element, this.payload);
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
		switch (element.tagName) {
			case 'INPUT':
				if (element.checkValidity()) {
					isValid = element.value === '' ? this.setInvalid(element) : this.setValid(element);
				}
				break;
			case 'TEXTAREA':
				if (element.checkValidity()) {
					isValid = element.text === '' ? this.setInvalid(element) : this.setValid(element);
				}
				break;
			default:
				console.warn('Failed to validate ' + element.tagName);
				this.setInvalid(element);
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
			switch (element.tagName) {
				case 'INPUT':
				case 'TEXTAREA':
				case 'SELECT':
					this.validateInput(element);
					break;
				case 'FIELDSET':
				case 'BUTTON':
					break;
				default:
					console.warn(this.toString() + '.validate()', element.tagName);
			}
		}
		if (!this.payload.isValid) {
			console.log('Validation Result: ' + this.payload.isValid);
		}
		return this.payload;
	}
	validateInput(element) {
		if (element.name === 'undefined' || element.name === '') {
			console.warn('Unnamed element exists in ' + this.toString(), element);
		} else {
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
				default:
					console.warn('Unable to validate unidentified form element type.', element.type, element.value);
			}
		}
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
        return [...this.el.elements].filter((el) => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA').map((e) => this.inputToResult(e));
		//return $(this.el).serializeArray();
    }
    /** Creates a simple input key/value object from an input
        @param {MODEL} inp INPUT Model
        @return {{name:string, value:any}} key value pair
    */
    inputToResult(inp) {
        return {
            name: inp.name,
            value: inp.value
        };
    }
	/** If valid, Returns a FormPost based on values in this form
	    @returns {FORMPOST} A FormPost Object
	*/
	getFormPost() {
		return this.validate().isValid ? new FORMPOST(this.id, this.getResultsAsArray()) : null;
	}
	/* eslint-disable max-lines-per-function */
	/** Post FORM values to server
	    @returns {Promise<object>} The results of the Form Post
	*/
	post() {
		return new Promise((resolve, reject) => {
			/** @type {CONTAINER} */
            let main = this.getContainer().getMain();
            if (main === null) {
                main = this.getDialog().getMain();
            }
			/** @type {LOADER} */
            let loader = main.getLoader();

			let data = this.getFormPost();
			let url = this.getAction();
			let statusCode = 0;
			let message = '';
			if (data) {
                try {
                    console.log(this.toString() + '.post()', url, data);
                    loader.log(20, this.toString() + '.post()').then(() => {
                        this.lock();
                        $.ajax({
                            url,
                            type: 'POST',
                            data,
                            error(xhr, statusText, errorThrown) {
                                //console.warn('An Unknown Error Occurred');
                                //console.log('Ajax Error: ' + statusText + '(' + xhr.status + ') Error: ' + errorThrown);
                                let err = 'An Unknown Error Occurred.\nAjax Error: ' + statusText + '(' + xhr.status + ')\nError: ' + errorThrown
                                loader.log(99, err, true, true, 1000, 'error');
                            },
                            statusCode: { // https://www.digitalocean.com/community/tutorials/how-to-troubleshoot-common-http-error-codes
                                200(response) { // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success
                                    statusCode = 200;
                                    //message += response.message;
                                    //loader.log(100, 'StatusCode: 200, "' + response.message + '"');
                                },
                                201(response) {
                                    statusCode = 201;
                                    message += response.message;
                                    loader.log(100, 'StatusCode: 201, "' + response.message + '"');
                                },
                                400(response) { // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#4xx_Client_errors
                                    statusCode = 400;
                                    message += response.message;
                                    loader.log(100, 'StatusCode: 400, "' + response.message + '"');
                                },
                                403(response) { // Forbidden
                                    statusCode = 403;
                                    message += response.message;
                                    console.warn('You shall not pass!');
                                    let err = this.toString() + '.post() StatusCode: ' + statusCode + ', "' + url + '" Access Denied. Log in to continue. ' + response.message;
                                    loader.log(99, err, true, true, 1000, 'warning').then(() => main.login());
                                    //console.log(this.toString() + '.post() StatusCode: ' + statusCode + ', "' + url + '" Access Denied. Log in to continue. ' + response.message);
                                    //console.log('403 Error', response);
                                    //resolve(main.login());
                                },
                                404(response) {
                                    statusCode = 404;
                                    message += response.message;
                                },
                                500(response) { // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_errors
                                    statusCode = 500;
                                    message += response.message;
                                    loader.log(99, 'StatusCode: 500, ' + response.message, true, true, 3000, 'warning');
                                    //resolve(payload);
                                    //loader.log(99, err, true, true, 1000, 'warning');
                                }
                            },
                            success: (payload) => {
                                //console.log(this.toString() + '.post() StatusCode: ' + statusCode + '\n' + message);
                                let msg = this.toString() + '.post() Success\n' + message;
                                loader.log(99, msg);
                                //console.log('Payload Result: ' + payload.result);
                                //if (payload.result === 0) {
                                //    main.login();
                                //}
                                this.unlock();
                                this.afterSuccessfulPost(payload);
                                resolve(payload);
                            }
                        });
                    });
				} catch (e) {
                    console.warn(this.toString() + '.post() Post Failed to submit', e);
                    loader.log(99, this.toString() + '.post() Post Failed to submit', true, true, 1000, 'error');
					reject(e); //new Error('Post Failed to submit')
				}
			} else {
				console.warn(this.toString() + '.post() Invalid FormPost');
				reject(new Error(this.toString() + '.post() Invalid FormPost'));
			}
		});
	}
	/* eslint-enable max-lines-per-function */
}
export { ATTRIBUTES, BUTTON, BUTTONGROUP, CONTAINER, EL, FORMELEMENT, FORMELEMENTGROUP, FORMFOOTER, FORMINPUT, FORMPOST, FORMPOSTINPUT, INPUTTYPES, LOADER, MODEL }
/* eslint-enable max-lines */