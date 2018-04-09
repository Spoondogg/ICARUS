/**
    Represents a <SELECT> for an Icarus Form    
*/
class SELECT extends FORMELEMENT {
    /**
        An Input/Select OPTION constructor.
        @param {EL} node The parent
        @param {string} model The Form Select model
        @param {array} options A collection of key,value pairs
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.input = new EL(this.body.pane, 'SELECT', new MODEL(
            new ATTRIBUTES({
                'class': 'form-control',
                'name': friendly('INPUT_' + guid())
            })
        ));

        this.input.el.setAttribute('readonly', 'readonly');
        
        // Construct each select option
        try {
            for (var o = 0; o < this.children.length; o++) {
                this.addOption(this.children[o].label, this.children[o].value, value === this.children[o].value);
            }
        } catch (e) { /* console.log(e) */ }
    }

    /**
        Adds a Nav Item to this Drop Down Menu Group
        @param {MODEL} model Nav Item Model
        @returns {OPTION} An INPUT OPTION
     */
    addFormElementOption(model) {
        this.children.push(
            new OPTION(this, model, model.hasDropdown)
        );
        return this.children[this.children.length - 1];
    }

    /**
        Adds an <OPTION> to this <SELECT>
        @param {string} label The label
        @param {string} value The value
        @param {boolean} selected If true, option is selected
    */
    addOption(label, value, selected) {        
        if (label === undefined || value === undefined) {
            try {
                this.prompt = new PROMPT('Add Option', 'Add an option to this select input:');

                this.prompt.formGroup.addInput('Label', IcarusInputType.TEXT, '');
                this.prompt.formGroup.addInput('Value', IcarusInputType.TEXT, '');

                this.prompt.buttonGroup.addButton('Add Option').el.onclick = function () {
                    this.options.push(
                        new Option(
                            this,
                            $(this.prompt.el).find('input[name="Label"]')[0].value,
                            $(this.prompt.el).find('input[name="Value"]')[0].value
                        )
                    );
                    this.prompt.hide();
                }.bind(this);

                this.prompt.buttonGroup.addButton('Cancel').el.onclick = function () {
                    this.prompt.hide();
                }.bind(this);

                this.prompt.show();

            } catch (e) { console.log('Unable to change name for this element\n' + e); }

        } else {
            this.options.push(
                new Option(this, label, value)
            );
        }
    }    
}