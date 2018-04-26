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

        this.btnEdit = new SPAN(this.inputGroup, new MODEL(new ATTRIBUTES('input-group-addon')), 'EDIT');
        this.btnEdit.el.onclick = this.editAttributes.bind(this);

        this.btnNew = new SPAN(this.inputGroup, new MODEL(new ATTRIBUTES('input-group-addon')), 'NEW');
        this.btnNew.el.onclick = this.newAttributes.bind(this);
    } 

    /**
     * Sets the id of the original FormPostInput to the given value
     * @param {number} id
     */
    updateInput(id) {
        this.input.el.value = id;
    }

    /**
        Opens a Modal Form populated with an open version of the FormPost
     */
    newAttributes() {
        let prompt = null;
        let inputs = [];

        // Generate new FormPost
        try {
            $.getJSON('/FORMPOST/Get/0', function (data) {
                console.log('Created new Form Post / Attributes');
                console.log(data.model);

                // NOW, MAKE A PROMPT for this ATTRIBUTES FORMPOST using the given FormPostId/AttributesId
                prompt = new PROMPT(
                    'FORMPOSTINPUT: Save ATTRIBUTES()', 'Saves the ATTRIBUTES() via FORMPOSTINPUT', [],
                    [
                        new MODEL(new ATTRIBUTES({
                            'name': 'id',
                            'value': data.model.id
                        })).set({
                            'element': 'INPUT',
                            'label': 'id'
                        })
                    ]
                );

                prompt.formElementGroup.toggleHeaders();

                prompt.form.setPostUrl('FormPost/Set');
                prompt.form.afterSuccessfulPost = function () { 
                    console.log('success');
                    this.updateInput(data.model.id);
                    prompt.form.loader.hide(200);
                    prompt.close(300);
                }.bind(this);

                prompt.show();

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
        let prompt = null;
        let inputs = [];

        inputs.push(
            new MODEL(new ATTRIBUTES({
                'name': 'id',
                'value': this.input.attributes.value
            })).set({
                'element': 'INPUT',
                'type': 'FORMPOST',
                'label': 'id'
            })
        );

        // Test to see if the formpost can be retrieved
        try {
            $.getJSON('/FORMPOST/Get/' + this.input.attributes.value, function (data) {
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

                // NOW, MAKE A PROMPT for this ATTRIBUTES FORMPOST using the given FormPostId/AttributesId
                prompt = new PROMPT(
                    'FORMPOSTINPUT: Save ATTRIBUTES()', 'Saves the ATTRIBUTES() via FORMPOSTINPUT',
                    [], inputs
                );

                prompt.formElementGroup.toggleHeaders();

                prompt.form.setPostUrl('FormPost/Set');
                prompt.form.afterSuccessfulPost = function () { 
                    console.log('success');
                    this.updateInput(data.model.id);
                    prompt.form.loader.hide(200);
                    prompt.close(300);
                }.bind(this);
                prompt.show();

            }.bind(this));
        } catch (e) {
            console.log('Unable to retrieve FormPost.');
            console.log(e);
        }
    }
}