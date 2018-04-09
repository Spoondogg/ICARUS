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

        this.form = new FORM(
            this.container.body.pane,
            new MODEL().set({
                'label': 'PROMPT FORM',
                'collapsed': false,
                'showHeader': false,
                'hasTab': false
            })
        );
        this.fieldset = new FIELDSET(
            this.form.body.pane, new MODEL().set({
                'label': 'FIELDSET',
                'collapsed': false,
                'showHeader': false,
                'hasTab': false
            })
        );
        this.formElementGroup = new FORMELEMENTGROUP(
            this.fieldset.body.pane, new MODEL().set({
                'label': 'FORMELEMENTGROUP',
                'collapsed': false,
                'showHeader': false,
                'hasTab': false
            })
        );

        // Adjust styling for PROMPT.  TOOD: This should just be css
        //this.form.fieldset.header.hide();

        if (inputs) {
            this.formElementGroup.populate(inputs); 
        }

        // Add any buttons that were provided
        if (buttons) {
            for (let b = 0; b < buttons.length; b++) {
                this.form.footer.buttonGroup.addButton(buttons[b][0], buttons[b][1], buttons[b][2]);
            }
        }
    }    
}