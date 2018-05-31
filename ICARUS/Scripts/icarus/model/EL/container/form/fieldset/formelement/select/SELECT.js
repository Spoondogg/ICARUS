﻿/**
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

        //this.input.el.setAttribute('readonly', 'readonly');

        this.dataElements = ['options'];

        console.log('Select Options');
        // Construct each select option based on this.data.options
        if (this.dataId > 0) {
            let options = this.data.options.split(',');
            try {
                for (let o = 0; o < options.length; o++) {
                    console.log('Option[' + o + ']: ' + options[o]);
                    //this.addOption(options[o].label, options[o].value, value === options[o].value);
                    //this.addOption(options[o], options[o]);
                    new OPTION(this.input, options[o], options[o]);
                }
            } catch (e) {
                debug(e);
            }
        }
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
    addOption(label, value) { 
        console.log('addOption(' + label + ',' + value + ');');
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
            let opt = new OPTION(this.input, label, value);
            this.input.options.push(opt);
        }
    }    
}