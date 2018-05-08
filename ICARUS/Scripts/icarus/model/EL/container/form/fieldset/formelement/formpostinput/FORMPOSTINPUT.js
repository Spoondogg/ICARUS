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

                //this.prompt.formElementGroup.toggleHeaders();
                this.form.fieldset.formElementGroup.toggleHeaders();

                this.form.setPostUrl('FormPost/Set');
                this.form.afterSuccessfulPost = function () { 
                    console.log('success');
                    this.updateInput(data.model.id);
                    this.form.loader.hide(200);
                    //this.prompt.close(300);
                }.bind(this);

                //this.prompt.show();

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
                    console.log('Retrieved form post: ' + this.input.attributes.value);
                    console.log(data.model);
                    console.log('Parsed...');
                    let parsed = JSON.parse(data.model.jsonResults);
                    console.log(parsed);

                    for (let i = 0; i < parsed.length; i++) {
                        if (parsed[i].name !== 'id') {
                            inputs.push(
                                new MODEL(new ATTRIBUTES({
                                    'name': parsed[i].name,
                                    'value': parsed[i].value
                                })).set({
                                    'element': 'INPUT',
                                    'label': parsed[i].name
                                })
                            );
                        }
                    }

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
                        this.form.loader.hide(200);
                        //this.prompt.close(300);
                    }.bind(this);                    

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
}