﻿/**
    Constructs an Icarus Form Object.

    An IcarusForm is the underlying form data type for all other page constructors
    and is designed to submit an XML object for Object States.

    @class
*/
class IcarusForm extends CONTAINER {
    /**
        Constructs an Icarus Form.

        @param {EL} node The parent object
        @param {MODEL} model The object model
        param {string} antiForgeryToken The token that is provided by the server for POST validation
     */
    constructor(node, model) {
        super(node, 'FORM', model);

        // Authenticates the user for the duration of the session
        this.antiForgeryTokenElem = new AntiForgeryTokenInput(this, app.getAntiForgeryToken());

        // The default post url
        this.setPostUrl('Form/Submit');
        this.updateUrl = 'Form/Update';

        this.loader = null;

        this.modal = null;

        /**
            Retrieves a list of groups from the database and displays them in a model
            The contents of the selected value should be added to the form
            This may require a new 'addFieldSet' method
        */
        //this.header.collapse.options.addListItem('CRUD', 'Load', ICON.LOAD).el.onclick = this.load.bind(this);

        //this.header.collapse.options.list.emptyGroup('ELEMENTS');
        
        this.addContainerCase('FIELDSET');

        // Add the submit button
        this.footer = new IcarusFormFooter(this, new MODEL());
        this.footer.buttonGroup.addButton('Reset', ICON.RESET).el.onclick = this.reset.bind(this);
        this.footer.buttonGroup.addButton('Submit', ICON.SAVE).el.onclick = this.submit.bind(this);

        this.populate(model.children);
    }

    /**
     * Updates the model for this object 
     */
    afterSuccessfulPost() {
        console.log('IcarusForm: POST post posting');
    }

    /**
     * Retrieves the Post Url for this class.  // TODO: Is this necessary?
        @returns {string} The Url that this form POSTs to
     */
    getPostUrl() {
        return this.postUrl;
    }

    /**
     * Sets the POST url for this form
     * @param {string} url Target url
     */
    setPostUrl(url) {
        this.postUrl = url;
    }

    /**
        Disables all fieldsets within this form
    */
    lock() {
        console.log('Locking form...');
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].el.disabled = true;
        }
    }

    /**
        Enables all fieldsets within this form
    */
    unlock() {
        console.log('Unlocking form...');
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].el.disabled = false;
        }
    }
    
    /**
        HTML encodes all form element values.  
    */
    htmlEncodeValues() {
        for (let e = 0; e < this.el.elements.length; e++) {
            this.el.elements[e].value = htmlEncode(this.el.elements[e].value);
        }
    }

    /**
        Validate the current form and return true if form is valid
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

        for (let e = 0; e < this.el.elements.length; e++) {
            switch (this.el.elements[e].type) {
                case 'input':
                    if (this.el.elements[e].value === '') {
                        this.payload.isValid = false;
                        this.el.elements[e].focus();
                        this.el.elements[e].setAttribute('data-valid', this.payload.isValid);
                        $(this.el.elements[e].previousSibling).addClass('invalid');
                    } else {
                        $(this.el.elements[e]).removeClass('invalid');
                    }
                    break;

                case 'select-one':
                    if (this.el.elements[e].selectedIndex === 0) {
                        this.payload.isValid = false;
                        this.el.elements[e].focus();
                        this.el.elements[e].setAttribute('data-valid', this.payload.isValid);
                        $(this.el.elements[e].previousSibling).addClass('invalid');
                    } else {
                        $(this.el.elements[e]).removeClass('invalid');
                    }
                    break;
            }
        }
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
        console.log('icarusForm.getResultsAsArray()');
        return $(this.el).serializeArray();
    }

    /**
        Returns a FormPost based on values in this form
        @returns {FormPost} A FormPost Object
    */
    getFormPost() {
        return this.validate() ? new IcarusFormPost(this) : null;
    }

    /**
        Post values to server.

        Posts the contents of the given Form Post to the specified url
        and updates the given prompt.

        param {CONTAINER} master The master element whos state and id is to be updated
    */
    post() {

        //let results = {};

        // Post results to server
        this.loader.setProgress(10, 'Posting values to server: ' + this.getPostUrl());

        let formPost = this.getFormPost();
        console.log(formPost);

        this.lock();

        /**
            JQuery POST
        */
        $.post(this.postUrl, formPost,
            /**
                Submit the payload and retrieves the status from the server
                @param {object} payload Data
                @param {string} status Response
            */
            function (payload, status) { // response from server

                this.loader.addText('Status: ' + status);
                console.log('Payload:');
                console.log(payload);

                // textStatus contains the status: success, error, etc
                // If server responds with 'success'            
                if (status === "success") {

                    this.loader.setProgress(25, 'Posted results to server.');

                    this.loader.setProgress(75, 'The ' + this.element+' "<span style="font-weight:bold">' +
                        formPost.label + '</span>" (ID: ' + formPost.id+') has been updated.<br><hr/>' +
                        payload.message + '<br><hr/>');

                    this.unlock();

                    this.loader.setProgress(100, 'Post Complete.');

                    // Update the Form with the appropriate ID if needed
                    //console.log('Updating ' + this.element + ' model...');
                    //this.updateModel(payload);

                    this.afterSuccessfulPost();


                } else {
                    console.log('Failed to POST results to server with status: "' + status + '"');
                    this.loader.setProgress(0, 'The form "<span style="font-weight:bold">' +
                        formPost.label + '</span>" was not saved.<br>' +
                        payload.message + '<br><hr/>'
                    );

                    console.log('Failed to submit form.\nPayload:\n');
                    console.log(payload);

                    btnReset.el.style.display = 'none;';

                    this.unlock();                    
                }
            }.bind(this), "json"
        );
    }

    /**
        Posts the form to the specified url.
        @param {string} url The url to post to
    */
    submit() {

        // TODO: LOADER, NOT PROMPT!
        console.log('IcarusForm.submit()');

        // First, ensure proper values have been set
        this.save();

        // Create a prompt to notify the user of the status of their request
        this.loader = new LOADER('Submitting Form Results', 'Your form is being submitted...');
        this.loader.show();

        // Generate a Form Post for this form and Post values
        this.post();
    }

    /**
        Updates the state of this Form on the server.
    */
    update() { // Forms/UpdateSection 

        try {

            // Create a prompt and populate its form with the required values
            this.prompt = new PROMPT('Update ' + this.element, 'Update this ' + this.element + ':');

            // TODO: Create a loader that pushes preset forms into this PROMPT
            this.prompt.form.formGroup.addInput('id', IcarusInputType.NUMBER, this.el.getAttribute('id'));
            this.prompt.form.formGroup.addInput('label', IcarusInputType.TEXT, this.getLabel()); //this.header.label.icon.label.el.innerHTML
            this.prompt.form.formGroup.addInput('name', IcarusInputType.TEXT, this.getName());
            this.prompt.form.formGroup.addInput('element', IcarusInputType.TEXT, this.element);
            this.prompt.form.formGroup.addInput('subsections', IcarusInputType.TEXT, this.children.length);

            this.prompt.form.setPostUrl('Forms/Update');

            /**
                @Override
                Override IcarusForm.submit() so that values are extracted
                directly from the form instead of posting the form payload
                to the server

                @param {string} url Target url
            
            this.prompt.form.submit = function () {
                var results = this.prompt.form.getFormPost().getResultsAsObject();

                // Set attributes for this SECTION based on FormPost object
                this.el.setAttribute('id', results['ID']);
                this.header.setLabel(results['Label']);
                this.el.setAttribute('name', friendly(results['Name']));

                // Hide the prompt
                this.prompt.hide();
            }.bind(this);
            */

            this.prompt.show();

        } catch (e) {
            console.log('Unable to change name for this ' + this.element + '\n' + e);
        }
    }
}