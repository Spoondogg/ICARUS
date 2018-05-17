/**
    Constructs an Icarus Form Object.

    An FORM is the underlying form data type for all other page constructors
    and is designed to submit an XML object for Object States.
*/
class FORM extends CONTAINER {
    /**
        Constructs an Icarus Form.

        @param {CONTAINER} node The parent object
        @param {MODEL} model The object model
     */
    constructor(node, model) {
        super(node, 'FORM', model);
        this.tokenInput = new TokenInput(this);
        this.setPostUrl('Form/Submit');
        this.updateUrl = 'Form/Update';
                
        this.addContainerCase('FIELDSET');

        // Add the submit button
        this.footer = new IcarusFormFooter(this.body, new MODEL());
        this.footer.buttonGroup.addButton('Reset', ICON.RESET).el.onclick = this.reset.bind(this);
        this.footer.buttonGroup.addButton('Submit', ICON.SAVE).el.onclick = this.post.bind(this);

        this.populate(model.children);
    }

    /**
        Retrieves the Post Url for this class.  // TODO: Is this necessary?
        @returns {string} The Url that this form POSTs to
     */
    getPostUrl() {
        return this.postUrl;
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
    HTML Encode the given value.

    Create a in-memory div, set it's inner text(which jQuery automatically encodes
    then grab the encoded contents back out.  The div never exists on the page.
    @param {any} value The string to be html encoded
    @returns {text} An html encoded string
     */
    htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    /**
        Decodes an HTML encoded value back into HTML string
        @param {any} value An html encoded string
        @returns {string} A string that was previously html encoded
     */
    htmlDecode(value) {
        return $('<div/>').html(value).text();
    }
    
    /**
        HTML encodes all form element values.  
    */
    htmlEncodeValues() {
        try {
            for (let e = 0; e < this.el.elements.length; e++) {
                this.el.elements[e].value = this.htmlEncode(this.el.elements[e].value);
                
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
            console.log('Element: ' + this.el.elements[e].name);
            switch (this.el.elements[e].type) {
                case 'input':
                case 'text':
                case 'email':
                case 'tel':
                case 'password':
                    console.log(this.el.elements[e].name + ' -- isValid: ' + this.el.elements[e].checkValidity());
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
        console.log('Result: '+this.payload.isValid);
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

        // Post results to server
        app.loader.log(10, 'Posting values to server: ' + this.getPostUrl());
        let formPost = this.getFormPost();
        debug('FORMPOST: ');
        debug(formPost);

        if (formPost) {

            this.lock();

            /**
                JQuery POST
            */
            console.log('Posting to: ' + this.postUrl);
            console.log(formPost);
            
            $.ajax({
                url: this.postUrl, 
                type: "POST",
                data: formPost,
                error: function (xhr, statusText, errorThrown) {
                    app.loader.log(100, 'Access Denied: ' + statusText + '('+ xhr.status+')');
                }.bind(this),
                statusCode: {
                    200: function (response) {
                        console.log('StatusCode: 200');
                        console.log(response);
                    },
                    201: function (response) {
                        console.log('StatusCode: 201');
                        console.log(response);

                    },
                    400: function (response) {
                        console.log('StatusCode: 400');
                        console.log(response);
                    },
                    403: function (response) {
                        console.log('StatusCode: 403');
                        console.log(response);
                        app.loader.log(100, 'Access Denied: ' + response);
                        app.login();
                    },
                    404: function (response) {
                        console.log('StatusCode: 404');
                        console.log(response);
                    }
                }, success: function (payload) {
                    console.log('Success');
                    app.loader.log(25, 'Posted results to server.');

                    app.loader.log(50,
                        'Updating...<br><hr/>'
                        + payload.message + '<br><hr/>'
                    );

                    this.unlock();
                    app.loader.log(100, 'Form Submitted');
                    this.afterSuccessfulPost();
                }.bind(this)
            });
            
        } else {
            console.log('FormPost is invalid');
            app.loader.log(50,
                'Failed to submit...<br><hr/>Values are invalid<br><hr/>'
            );            
            app.loader.log(100, 'Post Failed.');
            $(app.loader.console.el).collapse('show');
        }
    }
}