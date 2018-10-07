/**
    @module
*/
import CONTAINER, { ATTRIBUTES, ICONS, INPUTTYPES, MODEL } from '../container/CONTAINER.js';
import FIELDSET from '../fieldset/FIELDSET.js';
import FORMELEMENTGROUP from '../container/formelement/FORMELEMENTGROUP.js';
import FORMFOOTER from './FORMFOOTER.js';
import FORMINPUT from '../container/formelement/forminput/FORMINPUT.js';
import FORMINPUTTOKEN from '../container/formelement/forminput/forminputtoken/FORMINPUTTOKEN.js';
import FORMPOST from './FORMPOST.js';
/**
    Constructs an Icarus Form Object
    @description An FORM is the underlying form data type for all other page constructors
    and is designed to submit an XML object for Object States.

    @class
    @extends CONTAINER
*/
export default class FORM extends CONTAINER {
	/**
	    Constructs a Form for collecting and posting
	    @param {CONTAINER} node The parent object
	    @param {MODEL} model The object model
	 */
	constructor(node, model) {
		super(node, 'FORM', model, ['FIELDSET']);
		this.tokenInput = new FORMINPUTTOKEN(this, new MODEL().set({ 'token': '' })); //this.getMainContainer().getToken()
		this.setPostUrl('Form/Submit');
		this.updateUrl = 'Form/Update';
		/** 
		    @param {Array<FIELDSET>} 
		*/
		this.fieldsets = [];
		this.footer = new FORMFOOTER(this.body, new MODEL());
		this.footer.buttonGroup.addButton('Submit', ICONS.SAVE).el.onclick = this.post.bind(this);
		this.populate(model.children);
	}
	construct() {}
	/**
	    Populates this form with a single fieldset and formelementgroup
	    @param {EL} node Parent node
	    @param {boolean} hidden If true, form is hidden
	    @returns {FORM} An empty form container
	*/
	static createEmptyForm(node, hidden = false) {
		let form = new FORM(node, new MODEL(new ATTRIBUTES({
			'style': hidden ? 'display:none;' : ''
		})).set({
			'label': 'FORM',
			'showHeader': 0
		}));
		form.fieldset = new FIELDSET(form.body.pane, new MODEL().set({
			'label': 'FIELDSET',
			'showHeader': 0
		}));
		form.fieldset.formElementGroup = new FORMELEMENTGROUP(form.fieldset.body.pane, new MODEL().set({
			'label': 'FORMELEMENTGROUP',
			'showHeader': 0
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
	/**
		    Disables all fieldsets within this form
	        @returns {boolean} Returns true if successful
		*/
	lock() {
		try {
			//console.log('Locking FORM...');
			for (let i = 0; i < this.children.length; i++) {
				this.children[i].el.disabled = true;
			}
			return true;
		} catch (e) {
			console.log('Unable to lock this form');
			throw e;
		}
	}
	/**
		    Enables all fieldsets within this form
	        @returns {boolean} Returns true if successful
		*/
	unlock() {
		//console.log('Unlocking FORM...');
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
	/**
		    HTML encodes all form element values
	        @returns {void}
		*/
	htmlEncodeValues() {
		try {
			for (let e = 0; e < this.el.elements.length; e++) {
				console.log('Encode type: ' + this.el.elements[e].type);
				if (this.el.elements[e].type === 'text' || this.el.elements[e].type === 'textarea') {
					this.el.elements[e].value = this.htmlEncode(this.el.elements[e].value);
				}
			}
		} catch (e) {
			console.log('FORM.htmlEncodeValues() failed.');
			throw e;
		}
	}
	/*
	    Returns only alphanumeric characters
	    @param {any} str String to convert
	    @returns {string} A string of only alphanumeric characters
		
	alphaNumeric(str) {
		str = str === undefined ? '' : str.toString().replace(/^[a-zA-Z0-9-_]+$/, '');
		// /^[a-zA-Z0-9-_]+$/
		return str === null || str === undefined ? '' : str.toString().replace(/[\[\]']/g, '');
	} */
	/**
		     Flags the given element as invalid 
		     @param {any} element The form element
	         @returns {void}
		*/
	setInvalid(element) {
		this.payload.isValid = false;
		element.focus();
		element.setAttribute('data-valid', this.payload.isValid);
		$(element.previousSibling).addClass('invalid'); // Set label class to 'invalid'
	}
	/**
	    Validate the current form and return true if form is valid
	    Note that this is a simple form of validation that occurs on the
	    client side and should not be used as a substitution for
	    server side validation.
	    @returns {object} The validation payload
	*/
	validate() {
		//console.log('Validating...');
		this.htmlEncodeValues();
		this.payload = {
			isValid: true,
			formName: this.el.name
		};
		for (let e = 0; e < this.el.elements.length; e++) {
			//DEBUG.log('Element: ' + this.el.elements[e].name);
			switch (this.el.elements[e].type) {
				case 'input':
				case 'text':
				case 'email':
				case 'tel':
				case 'password':
					if (this.el.elements[e].checkValidity()) { // HTML5 Validation
						if (this.el.elements[e].value === '') {
							this.setInvalid(this.el.elements[e]);
						} else {
							$(this.el.elements[e]).removeClass('invalid');
							this.el.elements[e].setAttribute('data-valid', this.payload.isValid);
						}
						break;
					} else {
						console.log(this.el.elements[e].name + ' -- isValid: ' + this.el.elements[e].checkValidity());
						this.setInvalid(this.el.elements[e]);
						break;
					}
				case 'select-one':
					if (this.el.elements[e].selectedIndex === 0) {
						this.setInvalid(this.el.elements[e]);
					} else {
						$(this.el.elements[e]).removeClass('invalid');
						this.el.elements[e].setAttribute('data-valid', this.payload.isValid);
					}
					break;
				default:
					console.warn('Unable to validate unidentified form element type.');
			}
		}
		console.log('Validation Result: ' + this.payload.isValid);
		return this.payload;
	}
	/**
		    Resets the form and any validation notifications.
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
	/**
	    Serialize the form into an array
	    @returns {array} Form Results as an Array of key/value pairs
	*/
	getResultsAsArray() {
		console.log('FORM.getResultsAsArray()');
		return $(this.el).serializeArray();
	}
	/**
	    If valid, Returns a FormPost based on values in this form
	    @returns {FormPost} A FormPost Object
	*/
	getFormPost() {
		return this.validate().isValid ? new FORMPOST(this) : null;
	}
	/**
		    Post values to server.

		    Posts the contents of the given Form Post to the specified url
		    and updates the given prompt.

		    param {CONTAINER} master The master element whos state and id is to be updated
	        @async
	        @returns {Promise<object>} The results of the Form Post

		*/
	post() {
		console.log(10, 'Posting values to server: ' + this.postUrl);
		let formPost = this.getFormPost();
		if (formPost) {
			this.lock();
			console.log('Posting to: ' + this.postUrl, formPost);
			$.ajax({
				url: this.postUrl,
				type: "POST",
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
						console.log('StatusCode: 403', 'Access Denied', response);
						//app.login();
					},
					404(response) {
						console.log('StatusCode: 404', response);
					}
				},
				success: (payload) => {
					console.log('Posted results to server.', payload.message);
					this.unlock();
					this.afterSuccessfulPost(payload);
				}
			});
		} else {
			console.log(0, 'Post Failed to submit.  Values may be invalid.');
			this.getMainContainer().loader.showConsole();
		}
	}
	/**
	    Creates an Input Model
	    @param {string} element Element name
	    @param {string} name Input name
	    @param {string} label Label to display
	    @param {string} value Value of input
	    @param {string} type The input type
	    @returns {MODEL} An input model
	 */
	createInputModel(element, name, label, value = '', type = 'TEXT') {
		return new MODEL(new ATTRIBUTES({
			name,
			value,
			'type': type === 'FORMPOSTINPUT' ? 'NUMBER' : type
		})).set({
			element,
			label,
			type
		})
	}
}
export { ATTRIBUTES, FORMFOOTER, FORMINPUT, FORMPOST, INPUTTYPES, MODEL };