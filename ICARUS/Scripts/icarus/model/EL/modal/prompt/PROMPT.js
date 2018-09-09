import MODAL from '../MODAL.js';
import DEBUG from '../../../../DEBUG.js';
import CONTAINERFACTORY, { FORM } from '../../container/CONTAINERFACTORY.js';
/**
    A modal prompt.
    
    Creates a modal and displays a text well and any buttons that have
    been added.
*/
export default class PROMPT extends MODAL {
    /**
        @param {string} label The label
        @param {string} text The html text that is displayed in the prompt's well
        @param {array} buttons Array of [label, glyphicon, buttonType]
        @param {array} inputs Array of inputs
        @param {boolean} vertical If true, prompt is vertically centered
     */
    constructor(label, text, buttons, inputs, vertical) {
        DEBUG.log('PROMPT('+label+');');
        super(label, text, vertical);
        this.addClass('prompt');

        this.form = CONTAINERFACTORY.createEmptyForm(this.container.body.pane, false);
        this.form.prompt = this;

        // TODO: Fix this up
        if (inputs) {
            for (let i = 0; i < inputs.length; i++) {
                //DEBUG.log('inputs[' + i + ']: ' + inputs[i].type);
                let inp = null;
                if (inputs[i].type === 'FORMPOSTINPUT') {
                    //DEBUG.log('FORMPOSTINPUT');
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