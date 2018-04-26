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

        console.log('Creating prompt form...');
        this.form = new FORM(
            this.container.body.pane,
            new MODEL().set({
                'label': 'PROMPT FORM',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        this.form.prompt = this;
        this.fieldset = new FIELDSET(
            this.form.body.pane, new MODEL().set({
                'label': 'FIELDSET',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );
        this.formElementGroup = new FORMELEMENTGROUP(
            this.fieldset.body.pane, new MODEL().set({
                'label': 'FORMELEMENTGROUP',
                'collapsed': 0,
                'showHeader': 0,
                'hasTab': 0
            })
        );

        // TODO: Fix this up
        if (inputs) {
            for (let i = 0; i < inputs.length; i++) {
                console.log('inputs[' + i + ']: ' + inputs[i].type);
                let inp = null;
                if (inputs[i].type === 'FORMPOSTINPUT') {
                    console.log('FORMPOSTINPUT');
                    new FORMPOSTINPUT(this.formElementGroup.body.pane, inputs[i]);
                } else {
                    new INPUT(this.formElementGroup.body.pane, inputs[i]);
                }

                this.formElementGroup.children.push(inp);
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