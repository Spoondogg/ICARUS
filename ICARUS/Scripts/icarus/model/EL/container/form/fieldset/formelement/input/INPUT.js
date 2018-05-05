/**
    Represents an <INPUT> for an Icarus Form
*/
class INPUT extends FORMELEMENT {
    /**
        Constructs an INPUT element
        @param {EL} node Parent
        @param {MODEL} model The model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.input = new EL(this.body.pane, 'INPUT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'type': model.attributes.type || 'TEXT',
                'list': model.attributes.name + '-options',
                'name': model.attributes.name,
                'value': model.attributes.value || ''
            })
        )); 
        /*
        if (model.attributes.readonly) {
            this.input.el.setAttribute('readonly', 'readonly');
        }
        */

        /*
        this.label.el.onclick = function () {
            this.setLabel('woot');
        }.bind(this);
        */

        this.options = [];
        this.datalist = new EL(node, 'DATALIST', new MODEL(
            new ATTRIBUTES({
                'id': model.attributes.name + '-options'
            })
        ));
        if (Array.isArray(model.options)) {
            for (let o = 0; o < model.options.length; o++) {
                this.addOption(model.options[o].value);
            }
        }
    }

    /**
        Sets the label of this element to the given value.
        @param {string} label The name to be set
    */
    setLabel(label) {
        this.navBar.header.tab.anchor.setInnerHTML(label);
        this.label.setInnerHTML(label);
        this.input.el.setAttribute('name', label);
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
                        new Option(
                            this.datalist.el,
                            $(this.prompt.el).find('input[name="label"]')[0].value,
                            $(this.prompt.el).find('input[name="value"]')[0].value
                        )
                    );
                    this.prompt.hide();
                }.bind(this);

                this.prompt.buttonGroup.addButton('Cancel').el.onclick = this.prompt.hide.bind(this);

                this.prompt.show();

            } catch (e) {
                console.log('Unable to change name for this element');
                console.log(e);
            }
        } else {
            this.options.push(
                new Option(this.datalist.el, label, value)
            );
        }
    }
}