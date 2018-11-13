/** @module */
import CONTAINER, { ATTRIBUTES, ICONS, INPUTTYPES, MODEL } from '../container/CONTAINER.js';
import { ALIGN } from '../../../enums/ALIGN.js';
import FIELDSET from '../fieldset/FIELDSET.js';
import FORMFOOTER from './FORMFOOTER.js';
import FORMINPUT from '../container/formelement/forminput/FORMINPUT.js';
import FORMINPUTTOKEN from '../container/formelement/forminput/forminputtoken/FORMINPUTTOKEN.js';
import FORMPOST from './FORMPOST.js';
/** An Icarus Form Object
    @description An FORM is the underlying form data type for all other page constructors
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
		super(node, 'FORM', model, ['FIELDSET']); //
		//this.el.setAttribute('onsubmit', 'return false;');
		//this.addCase('FIELDSET', () => this.addFieldset(model));
		this.tokenInput = new FORMINPUTTOKEN(this); //, new MODEL().set({ 'value': this.getToken() })
		this.setPostUrl('Form/Submit');
		this.updateUrl = 'Form/Update';
		this.footer = new FORMFOOTER(this.body, new MODEL().set({
			align: ALIGN.VERTICAL
		}));
		this.footer.buttonGroup.addButton('Submit', ICONS.SAVE, 'SUBMIT').el.onclick = (e) => {
			e.preventDefault();
			this.post();
			return false;
		};
		this.populate(model.children);
	}
	construct() {}
	/** Constructs a Fieldset for this FORM
        @todo Verify that this overrides the initial fieldset
	    @param {MODEL} model Object model
	    @returns {FIELDSET} A Form Fieldset element
	*/
	addFieldset(model) {
		this.children.push(new FIELDSET(this.body.pane, model));
		return this.addGroup(this.children[this.children.length - 1]);
	}
	/** Populates this form with a single fieldset and formelementgroup
	    @param {EL} node Parent node
	    @param {boolean} hidden If true, form is hidden
	    @returns {FORM} An empty form container
	*/
	static createEmptyForm(node, hidden = false) {
		let form = new FORM(node, new MODEL(new ATTRIBUTES({
			style: hidden ? 'display:none;' : ''
		})).set({
			label: 'FORM',
			showNav: 0
		}));
		form.addFieldset(new MODEL().set({
			showNav: 0
		})).addFormElementGroup(new MODEL().set({
			showNav: 0
		}));
		return form;
	}
	/**
        Sets the POST url for this form
        @param {string} url Target url
        @returns {ThisType} Returns this form
    */
	setPostUrl(url) {
		this.postUrl = url;
		return this;
	}
	/** Disables all fieldsets within this form
	    @returns {boolean} Returns true if successful
	*/
	lock() {
		try {
			this.children.forEach((ch) => {
				ch.el.disabled = true;
			});
			return true;
		} catch (e) {
			console.log('Unable to lock this form');
			throw e;
		}
	}
	/** Enables all fieldsets within this form
	    @returns {boolean} Returns true if successful
	*/
	unlock() {
		for (let i = 0; i < this.children.length; i++) {
			try {
				this.children[i].el.disabled = false;
			} catch (e) {
				if (e instanceof TypeError) {
					console.warn('Unable to lock "' + this.children[i].element + '"');
				} else {
					throw e;
				}
			}
		}
	}
	/** HTML encodes all form element values
	    @returns {void}
	*/
	htmlEncodeValues() {
		try {
			for (let e = 0; e < this.el.elements.length; e++) {
				//console.log('Encode type: ' + this.el.elements[e].type);
				if (this.el.elements[e].type.toUpperCase() === 'TEXT' || this.el.elements[e].type.toUpperCase() === 'TEXTAREA') {
					this.el.elements[e].value = this.htmlEncode(this.el.elements[e].value);
				}
			}
		} catch (e) {
			console.log('FORM.htmlEncodeValues() failed.');
			throw e;
		}
	}
	/** Flags the given element as invalid 
		@param {any} element The form element
	    @returns {void}
	*/
	setInvalid(element) {
		this.payload.isValid = false;
		element.focus();
		element.setAttribute('data-valid', this.payload.isValid);
		console.log(element.name + ' is invalid', element);
		$(element.previousSibling).addClass('invalid'); // Set label class to 'invalid'
	}
	/** Validate the current form and return true if form is valid
	    Note that this is a simple form of validation that occurs on the
	    client side and should not be used as a substitution for
	    server side validation.
	    @returns {object} The validation payload
	*/
	validate() {
		this.htmlEncodeValues();
		this.payload = {
			isValid: true,
			formName: this.el.name
		};
		// For loop outperforms forEach because of break;
		// @see https://thejsguy.com/2016/07/30/javascript-for-loop-vs-array-foreach.html
		for (let e = 0; e < this.el.elements.length; e++) {
			let element = this.el.elements[e];
			switch (element.type) {
				case 'hidden':
				case 'input':
				case 'text':
				case 'email':
				case 'tel':
				case 'password':
					this.validateString(element);
					break;
				case 'number':
					if (element.checkValidity()) { // HTML5 Validation
						$(element).removeClass('invalid');
						element.setAttribute('data-valid', this.payload.isValid);
						break;
					} else {
						console.log(element.name + ' -- isValid: ' + element.checkValidity());
						this.setInvalid(element);
						break;
					}
				case 'checkbox':
					if (element.required) {
						if (!element.checked) {
							this.setInvalid(element);
							break;
						}
					}
					break;
				case 'select-one':
					if (element.selectedIndex === 0) {
						this.setInvalid(element);
					} else {
						$(element).removeClass('invalid');
						element.setAttribute('data-valid', this.payload.isValid);
					}
					break;
				default:
					console.warn('Unable to validate unidentified form element type.', element.type, element.value);
			}
		}
		console.log('Validation Result: ' + this.payload.isValid);
		return this.payload;
	}
	/** Validates the given element as a STRING using HTML5 validation
	    @param {HTMLElement} element The Input element
	    @see https://www.w3schools.com/js/js_validation_api.asp
	    @returns {element} The element for chaining
	*/
	validateString(element) {
		if (element.checkValidity()) {
			if (element.value === '') {
				this.setInvalid(element);
			} else {
				$(element).removeClass('invalid');
				element.setAttribute('data-valid', this.payload.isValid);
			}
		} else {
			console.log(element.name + ' -- isValid: ' + element.checkValidity());
			this.setInvalid(element);
		}
		return element;
	}
	/** Resets the form and any validation notifications.
        @returns {void}
	*/
	reset() {
		console.log('Resetting form[' + this.el.name + ']');
		for (let e = 0; e < this.el.elements.length; e++) {
			this.el.elements[e].removeAttribute('data-valid');
			$(this.el.elements[e].previousSibling).removeClass('invalid');
		}
		this.el.reset();
	}
	/** Serialize the form into an array
	    @returns {array} Form Results as an Array of key/value pairs
	*/
	getResultsAsArray() {
		console.log('FORM.getResultsAsArray()', $(this.el).serializeArray());
		return $(this.el).serializeArray();
	}
	/** If valid, Returns a FormPost based on values in this form
	    @returns {FormPost} A FormPost Object
	*/
	getFormPost() {
		return this.validate().isValid ? new FORMPOST(this) : null;
	}
	/** Post values to server.
		Posts the contents of the given Form Post to the specified url
		and updates the given prompt.
		param {CONTAINER} master The master element whos state and id is to be updated
	    @async
	    @returns {Promise<object>} The results of the Form Post
	*/
	post() {
		return new Promise((resolve, reject) => {
			console.log(10, 'Posting values to server: ' + this.postUrl);
			let formPost = this.getFormPost();
			console.log('FormPost', formPost);
			if (formPost) {
				this.lock();
				$.ajax({
					url: this.postUrl,
					type: 'POST',
					data: formPost,
					error(xhr, statusText, errorThrown) {
						console.log(100, 'Access Denied: ' + statusText + '(' + xhr.status + ')', errorThrown);
					},
					statusCode: {
						200(response) {
							console.log('StatusCode: 200', response.message, true);
						},
						201(response) {
							console.log('StatusCode: 201', response);
						},
						400(response) {
							console.log('StatusCode: 400', response);
						},
						403(response) {
							console.log('StatusCode: 403', 'Access Denied. Log in to continue', response);
						},
						404(response) {
							console.log('StatusCode: 404', response);
						}
					},
					success: (payload) => {
						console.log('Posted results to server.', payload.message);
						this.unlock();
						this.afterSuccessfulPost(payload);
						resolve(payload);
					}
				});
			} else {
				console.log(0, 'Post Failed to submit.  Values may be invalid.');
				reject(new Error('Post Failed to submit.  Values may be invalid.'));
			}
		});
	}
}
export { ATTRIBUTES, FORMFOOTER, FORMINPUT, FORMPOST, INPUTTYPES, MODEL };