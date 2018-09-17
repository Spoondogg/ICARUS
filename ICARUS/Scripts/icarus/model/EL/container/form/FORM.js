/**
    @module
*/
import CONTAINER from '../CONTAINER.js';
import FIELDSET from '../fieldset/FIELDSET.js';
import FORMELEMENTGROUP from '../formelement/FORMELEMENTGROUP.js';
import MODEL from '../../../MODEL.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import TOKEN from '../formelement/input/TOKEN.js';
import FORMFOOTER from './FORMFOOTER.js';
import FORMPOST from './FORMPOST.js';
import { ICONS } from '../../../../enums/ICONS.js';
export { ATTRIBUTES }
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
        this.tokenInput = new TOKEN(this);
        this.setPostUrl('Form/Submit');
        this.updateUrl = 'Form/Update';
        this.footer = new FORMFOOTER(this.body, new MODEL());
        this.footer.buttonGroup.addButton('Submit', ICONS.SAVE).el.onclick = this.post.bind(this);
        this.populate(model.children);
    }

    construct() {

    }

    /**
        Sets the POST url for this form
        @param {string} url Target url
     */
    setPostUrl(url) {
        this.postUrl = url;
    }

    /**
        Disables all fieldsets within this form
    */
    lock() {
        try {
            console.log('Locking form...');
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].el.disabled = true;
            }
        } catch (e) {
            console.log('Unable to lock this form');
            console.log(e);
        }
    }

    /**
        Enables all fieldsets within this form
    */
    unlock() {
        console.log('Unlocking form...');
        for (let i = 0; i < this.children.length; i++) {
            try {
                this.children[i].el.disabled = false;
            } catch (e) {
                console.log(
                    e instanceof TypeError ? 'Unable to lock "' + this.children[i].element + '"' : e
                );
            }
        }
    }
    
    /**
        HTML encodes all form element values.  
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
            console.log(e);
        }
    }

    /**
        Returns only alphanumeric characters
        @param {any} str String to convert
        @returns {string} A string of only alphanumeric characters
     */
    alphaNumeric(str) {
        str = str === undefined ? '' : str.toString().replace(/^[a-zA-Z0-9-_]+$/, '');
        // /^[a-zA-Z0-9-_]+$/
        return str === null || str === undefined ? '' : str.toString().replace(/[\[\]']/g, '');
    }

    /**
     * Flags the given element as invalid 
     * @param {any} element The form element
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
        console.log('Validating...');

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
                            //this.el.elements[e].focus();
                            this.el.elements[e].setAttribute('data-valid', this.payload.isValid);
                            //$(this.el.elements[e].previousSibling).addClass('invalid');
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
            }
        }
        console.log('Validation Result: '+this.payload.isValid);
        return this.payload;
    }

    /**
        Resets the form and any validation notifications.
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
                error: function (xhr, statusText, errorThrown) {
                    console.log(100, 'Access Denied: ' + statusText + '('+ xhr.status+')');
                }.bind(this),
                statusCode: {
                    200: function (response) {
                        console.log('StatusCode: 200', response.message, true);                        
                    },
                    201: function (response) {
                        console.log('StatusCode: 201', response);

                    },
                    400: function (response) {
                        console.log('StatusCode: 400', response);
                    },
                    403: function (response) {
                        console.log('StatusCode: 403', response);
                        console.log(100, 'Access Denied: ' + response);
                        app.login();
                    },
                    404: function (response) {
                        console.log('StatusCode: 404', response);
                    }
                }, success: function (payload) {
                    console.log('Posted results to server.', payload.message);
                    this.unlock();
                    this.afterSuccessfulPost(payload);
                }.bind(this)
            });            
        } else {
            console.log(0, 'Post Failed to submit.  Values may be invalid.');
            app.loader.showConsole();
        }
    }
}