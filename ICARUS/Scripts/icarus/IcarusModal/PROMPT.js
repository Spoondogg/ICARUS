/**
    A modal prompt.
    
    Creates a modal and displays a text well and any buttons that have
    been added.
*/
class PROMPT extends MODAL {
    /**
        @param {string} label The label
        @param {string} text The html text that is displayed in the prompt's well
        @param {array} buttons Array of [label, glyphicon, buttonType]
        @param {array} inputs Array of inputs
        @param {boolean} vertical If true, prompt is vertically centered
     */
    constructor(label, text, buttons, inputs, vertical) {
        console.log('PROMPT('+label+');');
        super(label, text, vertical);
        this.addClass('prompt');

        this.form = new IcarusForm(
            this.body,
            new MODEL().set({
                'collapsed': false,
                'showHeader': false,
                'hasTab': false
            })
        );
        //this.form.header.hide();

        // Add a fieldset
        this.form.fieldset = new IcarusFieldSet(
            this.form.body, new MODEL().set({
                'collapsed': false,
                'showHeader': false,
                'hasTab': false
            })
        );

        // Adjust styling for PROMPT.  TOOD: This should just be css
        //this.form.fieldset.header.hide();

        this.form.fieldset.body.el.style.padding = '1em;';

        if (inputs) {
            for (let i = 0; i < inputs.length; i++) {
                this.form.fieldset.create('INPUT', inputs[i]); //.header.hide();
            }
        }

        // Add any buttons that were provided
        if (buttons) {
            for (let b = 0; b < buttons.length; b++) {
                this.form.footer.buttonGroup.addButton(buttons[b][0], buttons[b][1], buttons[b][2]);
            }
        }
    }    
}