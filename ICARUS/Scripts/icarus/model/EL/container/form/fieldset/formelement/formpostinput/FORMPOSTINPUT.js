/**
    Represents an <INPUT> for an Icarus Form
    A FormPost Input acts as a special input that is populated
    with the Form Post Editor
*/
class FORMPOSTINPUT extends FORMELEMENT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.createInput();

        this.populate(model.children);
    }

    createInput() {
        //console.log('FORMPOSTINPUT class');
        //console.log(model);

        this.inputGroup = new EL(this.body.pane, 'DIV', new MODEL(new ATTRIBUTES('input-group')));
        this.input = new EL(this.inputGroup, 'INPUT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'name': this.attributes.name,
                'value': this.attributes.value,
                'type': this.attributes.type || 'text'
            })
        ));

        this.form = null;

        //console.log('Val:' + model.attributes.value);
        //console.log(model);

        if (this.attributes.value > 0 || this.value > 0) {
            //console.log('btnEdit');
            this.btnEdit = new SPAN(this.inputGroup, new MODEL(new ATTRIBUTES('input-group-addon')), 'EDIT1');
            this.btnEdit.el.onclick = function () {
                console.log('Editing FormPost: ' + this.label);
                console.log(this);
                this.editFormPost();
            }.bind(this);
        }

        this.btnNew = new SPAN(this.inputGroup, new MODEL(new ATTRIBUTES('input-group-addon')), 'NEW1');
        this.btnNew.el.onclick = function () {
            
            // TODO:  PLEASE, fix this.  This is ugly
            //let container = this.node.node.node.node.node.node.node.node.node.node.node.node.node.node.node;
            //let container = this.getProtoTypeByClass('CONTAINER');
            let container = app.sidebar.target;

            //console.log('Container');
            //console.log(container);    

            this.newAttributes(container, this.attributes.name, this);
            

        }.bind(this);
    }

    /**
     * Sets the id of the original FormPostInput to the given value
     * @param {number} id Id to set
     */
    updateInput(id) {
        this.input.el.value = id;
    }

    /**
     * Opens a Modal Form populated with an open version of the FormPost
     * @param {CONTAINER} container The container that this belongs to
     * @param {string} dataIdLabel The key (dataId or attributesId) to add object to
     * @param {MODEL} model Model
     */
    newAttributes(container, dataIdLabel, model) {
        let inputs = [];

        // Generate new FormPost
        try {
            $.getJSON('/FORMPOST/Get/0', function (data) {
                console.log('Created new Form Post / Attributes / Image / Description');
                console.log(data.model);

                // Id, label and Shared are hardcoded
                inputs = [
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

                    /*
                    new MODEL(new ATTRIBUTES({
                        'name': 'label',
                        'value': data.model.label
                    })).set({
                        'element': 'INPUT',
                        'label': 'label'
                    })
                    */
                ];

                console.log('dataIdLabel: ' + dataIdLabel);
                console.log('container:');
                console.log(container);

                // Append any model inputs if they exist
                try {
                    for (let m = 0; m < model.inputs.length; m++) {
                        inputs.push(model.inputs[m]);
                    }
                } catch (e) {
                    //console.log(e);
                    console.log('No additional inputs exist for this form post');
                }

                


                // Set values in MODEL and DOM
                this.input.el.setAttribute('value', data.model.id);
                container[dataIdLabel] = data.model.id; 

                if (dataIdLabel === 'dataId') {
                    // Append additional dataElements
                    console.log('DATAELEMENTS:');
                    console.log(container.dataElements);

                    if (container.dataElements.length > 0) {
                        for (let i = 0; i < container.dataElements.length; i++) {
                            inputs.push(container.dataElements[i]);
                        }
                    }
                } 

                if (dataIdLabel === 'descriptionId') {
                    inputs.push(
                        new MODEL(new ATTRIBUTES({
                            'name': 'description',
                            'type': 'text'
                        })).set({
                            'element': 'TEXTAREA',
                            'label': 'description'
                        })
                    );
                }
                
                // Construct empty form
                this.form = container.createEmptyForm(this.body.pane);
                console.log('formpostinput: 3');
                //this.form.formId = 3;
                this.form.id = 3;
                this.form.el.setAttribute('id', 3);

                this.form.prompt = this;

                // TODO: Fix this up
                if (inputs) {
                    console.log('inputs:');
                    console.log(inputs);
                    for (let i = 0; i < inputs.length; i++) {
                        let inp = null;
                        if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].data.type === 'FORMPOSTINPUT' || inputs[i].attributes.type === 'FORMPOSTINPUT') {
                            console.log('WOOT');
                            console.log('FORMPOSTINPUT');
                            new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                        } else {
                            console.log('BLERT');
                            new INPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                        }
                        this.form.fieldset.formElementGroup.children.push(inp);
                    }
                }
                
                //this.form.fieldset.formElementGroup.toggleHeaders();

                this.form.setPostUrl('FormPost/Set');
                this.form.afterSuccessfulPost = function () { 
                    console.log('woot');
                    app.loader.log(100, 'Success');                    
                    this.updateInput(data.model.id);

                    // TODO: Iterate though input values
                    console.log('TODO: Iterate through inputs and update values in model');


                    //https://developers.google.com/web/fundamentals/primers/promises
                    let promise = new Promise(function (resolve, reject) {

                        console.log('Promise');
                        // do a thing, possibly async, then…
                        // How about saving the parent form (if exists)
                        console.log('saving parent form');
                        container.quickSave(true);



                        //console.log(result);
                        if (1 === 1) {
                            //resolve('Successfully created Element');
                            resolve('Saved');
                        } else {
                            reject(Error('Failed to create element'));
                        }
                    }.bind(this));

                    // @see https://scotch.io/tutorials/javascript-promises-for-dummies
                    promise.then(
                        function (result) {
                            console.log('promise success');
                            container.getProtoTypeByClass('CONTAINER').refresh();

                        }.bind(this),
                        function (err) {
                            console.log('promise fail');
                            console.log(err); // Error: "It broke"
                        }.bind(this)
                    );


                    

                    // promise to refresh parent?
                    

                    // refresh -- bad idea, creates duplication
                    //container.getProtoTypeByClass('CONTAINER').refresh();

                    //app.loader.hide();
                }.bind(this);

            }.bind(this));

        } catch (e) {
            app.loader.log(0, 'Unable to retrieve FormPost.');
            debug(e);
        }
    }

    /**
        Opens a Modal Form populated with an open version of the FormPost
        @param {ARRAY} inputArray Array of inputs
     */
    editFormPost(inputArray) {

        // If given value is an integer, assume this is the FormPostId, 
        // otherwise, retrieve the formpost
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

        // Test to see if the formpost can be retrieved
        try {
            $.getJSON('/FORMPOST/Get/' + this.input.attributes.value, function (data) {

                // If access granted...
                if (data.model) {
                    if (data.model.jsonResults) {
                        console.log('Retrieved form post: ' + this.input.attributes.value);
                        console.log(data.model);
                        console.log('Parsed...');
                        let parsed = JSON.parse(data.model.jsonResults);
                        console.log(parsed);


                        // If retrieved, push each node as an attribute/data value from jsonResults
                        for (let i = 0; i < parsed.length; i++) {
                            if (parsed[i].name !== 'id') {
                                console.log('parsed[' + i + ']:');
                                console.log(parsed[i]);
                                console.log('inputs[]:');
                                console.log(inputs);

                                inputs.push(
                                    new MODEL(new ATTRIBUTES({
                                        'name': parsed[i].name,
                                        'value': this.htmlDecode(parsed[i].value) || ''
                                    })).set({
                                        'element': 'INPUT',
                                        'label': parsed[i].name
                                    })
                                );
                                //inputs[i].attributes.value = this.htmlDecode(parsed[i].value) || '';

                            }
                        }

                        // Instead, set values of preset (based on DATAELEMENTS) inputs

                        this.form = this.createEmptyForm(this.body.pane);
                        console.log('formpostinput: 3');
                        this.form.id = 3;

                        // Empty out and populate with Form Elements only                    
                        this.form.fieldset.formElementGroup.navBar.header.menu.getGroup('ELEMENTS').empty();
                        this.form.fieldset.formElementGroup.addContainerCase('INPUT');
                        this.form.fieldset.formElementGroup.addContainerCase('SELECT');
                        this.form.fieldset.formElementGroup.addContainerCase('TEXTAREA');


                        // TODO: Fix this up
                        if (inputs) {
                            for (let i = 0; i < inputs.length; i++) {
                                console.log('inputs[' + i + ']: ' + inputs[i].type);
                                let inp = null;
                                if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].data.type === 'FORMPOSTINPUT') {
                                    console.log('FORMPOSTINPUT');
                                    new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                                } else {
                                    new INPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                                }

                                this.form.fieldset.formElementGroup.children.push(inp);
                            }
                        }


                        /*
                        // NOW, MAKE A PROMPT for this ATTRIBUTES FORMPOST using the given FormPostId/AttributesId
                        this.prompt = new PROMPT(
                            'FORMPOSTINPUT: Save ATTRIBUTES()', 'Saves the ATTRIBUTES() via FORMPOSTINPUT',
                            [], inputs
                        );
                        */
                        this.form.fieldset.formElementGroup.toggleHeaders();

                        this.form.setPostUrl('FormPost/Set');
                        this.form.afterSuccessfulPost = function () {
                            console.log('success');
                            this.updateInput(data.model.id);

                            //this.form.loader.hide(200);
                            //app.loader.hide();
                            //this.prompt.close(300);
                        }.bind(this);
                    } else {
                        console.log('Json Results empty');
                    }

                } else {
                    this.prompt = new MODAL('Exception', data.message);
                    this.prompt.show();

                    app.login();
                }

            }.bind(this));
        } catch (e) {
            console.log('Unable to retrieve FormPost.');
            console.log(e);
        }
    }

    /**
        Opens a Modal Form populated with an open version of the FormPost
     */
    editAttributes() {
        //this.prompt = null;
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
            $.getJSON('/FORMPOST/Get/' + id, function (data) {

                // If access granted...
                if (data.model) {
                    if (data.model.jsonResults) {
                        app.loader.log(80, 'Retrieved Post: ' + id);
                        console.log('Data Model:');
                        console.log(data.model);
                        let parsed = JSON.parse(data.model.jsonResults);
                        debug(parsed);

                        console.log('Creating elements for ' + this.node.className);
                        console.log(this.node);

                        let container = this.getContainer('dataId', id, this.node);
                        console.log('getContainer(' + data.model.id + ');');
                        //console.log(container);
                        if (container !== undefined) {

                            for (let i = 0; i < parsed.length; i++) {
                                if (parsed[i].name !== 'id') {

                                    let value = null;
                                    if (container[parsed[i].name]) {
                                        if (container[parsed[i].name].el) {
                                            value = container[parsed[i].name].el.innerHTML;
                                        }
                                    } else {
                                        value = parsed[i].value;
                                    }

                                    inputs.push(
                                        new MODEL(new ATTRIBUTES({
                                            'name': parsed[i].name,
                                            'value': value //parsed[i].value
                                        })).set({
                                            'element': 'INPUT',
                                            'label': parsed[i].name
                                        })
                                    );
                                }
                            }

                            app.loader.log(90, 'Creating Form');
                            try {
                                this.form.destroy();
                            } catch (e) {
                                debug(e);
                            }

                            this.form = this.createEmptyForm();
                            this.form.label = 'Modify';
                            this.form.fieldset.formElementGroup.label = 'Attributes';

                            // Empty out and populate with Form Elements only                    
                            this.form.fieldset.formElementGroup.navBar.header.menu.getGroup('ELEMENTS').empty();
                            this.form.fieldset.formElementGroup.addContainerCase('INPUT');
                            this.form.fieldset.formElementGroup.addContainerCase('SELECT');
                            this.form.fieldset.formElementGroup.addContainerCase('TEXTAREA');


                            // TODO: Include other inputs such as SELECT and TEXTAREA
                            if (inputs) {
                                app.loader.log(75, 'Loading Attributes');
                                for (let i = 0; i < inputs.length; i++) {
                                    let inp = null;
                                    if (inputs[i].type === 'FORMPOSTINPUT') {
                                        new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                                    } else {
                                        new INPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                                    }
                                    this.form.fieldset.formElementGroup.children.push(inp);
                                }
                            }

                            // Show headers so that inputs can be modified
                            this.form.fieldset.formElementGroup.toggleHeaders();

                            this.form.setPostUrl('FormPost/Set');
                            this.form.afterSuccessfulPost = function () {
                                app.loader.log(100, 'Updated Attributes');
                                this.updateInput(data.model.id);
                                //app.loader.hide();
                            }.bind(this);

                            //app.loader.hide();

                        } else {
                            app.loader.log('Unable to retrieve parent container');

                        }
                    } else {
                        console.log('Json Results empty');
                    }

                } else {
                    app.loader.log(0, data.message);
                    app.loader.log(0, 'An Exception Occurred');
                    app.login();
                }

            }.bind(this));
        } catch (e) {
            app.loader.log(0,'Unable to retrieve FormPost.');
            debug(e);
        }
    }
}