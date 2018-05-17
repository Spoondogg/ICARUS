/**
    Represents an <INPUT> for an Icarus Form
*/
class FORMPOSTINPUT extends FORMELEMENT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.inputGroup = new EL(this.body.pane, 'DIV', new MODEL(new ATTRIBUTES('input-group')));
        
        this.input = new EL(this.inputGroup, 'INPUT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'type': 'NUMBER',
                'name': model.attributes.name,
                'value': model.attributes.value
            })
        ));

        this.form = null;

        if (model.attributes.value > 0) {
            this.btnEdit = new SPAN(this.inputGroup, new MODEL(new ATTRIBUTES('input-group-addon')), 'EDIT');
            this.btnEdit.el.onclick = this.editAttributes.bind(this);
        } else {
            this.btnNew = new SPAN(this.inputGroup, new MODEL(new ATTRIBUTES('input-group-addon')), 'NEW');
            this.btnNew.el.onclick = this.newAttributes.bind(this);
        }
    } 

    /**
     * Sets the id of the original FormPostInput to the given value
     * @param {number} id Id to set
     */
    updateInput(id) {
        this.input.el.value = id;
    }

    /**
     * Recursively iterates through parent nodes until an object with the given 'attributeName' is found
     * @param {number} id Container Id
     */
    getContainer(id, attributeName, node = this.node, attempt = 0) {
        attempt++;
        console.log('Searching for '+attributeName+': ' + id + '(' + attempt + ')');
        console.log(node);
        if (attempt < 20) {
            try {
                console.log('id: ' + node.id);
                if (node[attributeName] == id) {
                    return node;
                } else {
                    return this.getContainer(id, attributeName, node.node, attempt++);
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log('Too many attempts (' + attempt + ')');
        }
    }

    /**
        Opens a Modal Form populated with an open version of the FormPost
     */
    newAttributes() {
        let inputs = [];

        // Generate new FormPost
        try {
            $.getJSON('/FORMPOST/Get/0', function (data) {
                console.log('Created new Form Post / Attributes');
                console.log(data.model);

                inputs = [
                    new MODEL(new ATTRIBUTES({
                        'name': 'shared',
                        'value': data.model.shared
                    })).set({
                        'element': 'INPUT',
                        'label': 'shared'
                    }),

                    new MODEL(new ATTRIBUTES({
                        'name': 'id',
                        'value': data.model.id
                    })).set({
                        'element': 'INPUT',
                        'label': 'id'
                    })
                ];

                console.log('Creating prompt form...');
                try {
                    this.form.destroy();
                } catch (e) {
                    console.log(e);
                }
                this.form = new FORM(
                    this.body.pane,
                    new MODEL().set({
                        'label': 'PROMPT FORM',
                        'collapsed': 0,
                        'showHeader': 0,
                        'hasTab': 0
                    })
                );
                this.form.prompt = this;
                this.form.fieldset = new FIELDSET(
                    this.form.body.pane, new MODEL().set({
                        'label': 'FIELDSET',
                        'collapsed': 0,
                        'showHeader': 0,
                        'hasTab': 0
                    })
                );
                this.form.fieldset.formElementGroup = new FORMELEMENTGROUP(
                    this.form.fieldset.body.pane, new MODEL().set({
                        'label': 'Attributes',
                        'collapsed': 0,
                        'showHeader': 0,
                        'hasTab': 0
                    })
                );
                //this.form.fieldset.formElementGroup.addContainerCase('ARTICLE');

                // TODO: Fix this up
                if (inputs) {
                    for (let i = 0; i < inputs.length; i++) {
                        console.log('inputs[' + i + ']: ' + inputs[i].type);
                        let inp = null;
                        if (inputs[i].type === 'FORMPOSTINPUT') {
                            console.log('FORMPOSTINPUT');
                            new FORMPOSTINPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                        } else {
                            new INPUT(this.form.fieldset.formElementGroup.body.pane, inputs[i]);
                        }

                        this.form.fieldset.formElementGroup.children.push(inp);
                    }
                }

                /*
                // Add any buttons that were provided
                if (buttons) {
                    for (let b = 0; b < buttons.length; b++) {
                        this.form.footer.buttonGroup.addButton(buttons[b][0], buttons[b][1], buttons[b][2]);
                    }
                }
                */
                
                this.form.fieldset.formElementGroup.toggleHeaders();

                this.form.setPostUrl('FormPost/Set');
                this.form.afterSuccessfulPost = function () { 
                    app.loader.log(100, 'Success');                    
                    this.updateInput(data.model.id);
                    app.loader.hide();
                }.bind(this);

            }.bind(this));
        } catch (e) {
            app.loader.log(0, 'Unable to retrieve FormPost.');
            debug(e);
        }
    }

    /**
        Opens a Modal Form populated with an open version of the FormPost
     */
    editAttributes() {
        //this.prompt = null;
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
                    app.loader.log(80, 'Retrieved Post: ' + id);
                    console.log('Data Model:');
                    console.log(data.model);
                    let parsed = JSON.parse(data.model.jsonResults);
                    debug(parsed);

                    console.log('Creating elements for ' + this.node.element);
                    console.log(this.node);
                    console.log('getContainer(' + data.model.id + ');');
                    console.log(this.getContainer(id, 'dataId', this.node));

                    let container = this.getContainer(id, 'dataId', this.node);

                    for (let i = 0; i < parsed.length; i++) {
                        if (parsed[i].name !== 'id') {

                            /*
                            for (let key in this.data) {
                                console.log('Adding data attributes');
                                inputs.push(
                                    new MODEL(new ATTRIBUTES({
                                        'name': key,
                                        'value': this[key] ? this[key].el ? this[key].el.innerHTML : this.data[key] : this.data[key]
                                    })).set({
                                        'element': 'INPUT',
                                        'label': key,
                                        'addTab': 0
                                    })
                                );
                            } 
                            */

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
                    this.form = new FORM(
                        this.body.pane,
                        new MODEL().set({
                            'label': 'Modify',
                            'collapsed': 0,
                            'showHeader': 0,
                            'hasTab': 0
                        })
                    );
                    this.form.prompt = this;
                    this.form.fieldset = new FIELDSET(
                        this.form.body.pane, new MODEL().set({
                            'label': 'FIELDSET',
                            'collapsed': 0,
                            'showHeader': 0,
                            'hasTab': 0
                        })
                    );
                    this.form.fieldset.formElementGroup = new FORMELEMENTGROUP(
                        this.form.fieldset.body.pane, new MODEL().set({
                            'label': 'Attributes',
                            'collapsed': 0,
                            'showHeader': 0,
                            'hasTab': 0
                        })
                    );

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
                        app.loader.hide();
                    }.bind(this);   

                    app.loader.hide();

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