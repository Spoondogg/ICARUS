/**
    Represents an <INPUT> for an Icarus Form
*/
class IcarusFormInput extends CONTAINER {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('form-input');

        // Create the Label
        let label = model ? model.label : '__NoLabel';
        this.label = new LABEL(this.body.pane, model ? model.label : '__NoLabel');
        this.label.el.onclick = this.save.bind(this);

        this.input = new EL(this.body.pane, 'INPUT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'type': 'TEXT',
                'list': 'INPUT_' + guid() + '-options',
                'name': friendly('INPUT_' + guid()),
                'value': '' //model.value
            })
        ));
        

        this.options = [];
        this.datalist = new EL(node, 'DATALIST', new MODEL(
            new ATTRIBUTES({
                'id': this.attributes.name + '-options'
            })
        ));
        if (Array.isArray(model.options)) {
            for (let o = 0; o < model.options.length; o++) {
                this.addOption(model.options[o].value);
            }
        }
    }    

    /**
        // TODO: Consider how to share these lists with the entire application rather than
        // reduntantly load the same data over and over again
        Adds an option to this input element
        @param {string} label The label
        @param {string} value The value
    */    
    addOption(label, value) {
        if (label === undefined || value === undefined) {
            try {
                this.prompt = new PROMPT('Add Option', 'Add an option to this select input:');

                this.prompt.formGroup.addInput('label', IcarusInputType.TEXT, '');
                this.prompt.formGroup.addInput('lalue', IcarusInputType.TEXT, '');

                this.prompt.buttonGroup.addButton('Add Option').el.onclick = function () {
                    this.options.push(
                        new IcarusFormOption(
                            this.datalist.el,
                            $(this.prompt.el).find('input[name="label"]')[0].value,
                            $(this.prompt.el).find('input[name="lalue"]')[0].value
                        )
                    );
                    this.prompt.hide();
                }.bind(this);

                this.prompt.buttonGroup.addButton('Cancel').el.onclick = this.prompt.hide.bind(this);

                this.prompt.show();

            } catch (e) {
                console.log('Unable to change name for this element\n' + e);
            }
        } else {
            this.options.push(
                new IcarusFormOption(this.datalist.el, label, value)
            );
        }
    }
}