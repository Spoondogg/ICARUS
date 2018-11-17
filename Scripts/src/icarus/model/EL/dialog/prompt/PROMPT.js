/** @module */
import DIALOG, { MODEL } from '../DIALOG.js';
import FORM from '../../form/FORM.js';
import FORMINPUT from '../../container/formelement/forminput/FORMINPUT.js';
import FORMPOSTINPUT from '../../container/formelement/formpostinput/FORMPOSTINPUT.js';
/** A Dialog with an embedded FORM that can be used to recieve input
    @description Creates a modal and displays a text well and any included buttons
    @class
    @extends DIALOG
*/
export default class PROMPT extends DIALOG {
	/** Constructs a PROMPT
	    @param {string} label The label
	    @param {string} text The html text that is displayed in the prompt's well
	    @param {array} buttons Array of [label, glyphicon, buttonType]
	    @param {array} inputs Array of inputs
	    @param {boolean} vertical If true, prompt is vertically centered
    */
	constructor(label, text, buttons, inputs, vertical) {
		super(new MODEL().set({
			label,
			text,
            vertical,
            container: null
		}));
		this.addClass('prompt');
        this.form = FORM.createEmptyForm(this.body, false);
		this.form.dialog = this;
		this.promptInputs = [];
		this.addInputs(inputs);
		this.addButtons(buttons);
	}
	/** Adds the provided inputs to the prompt
	    @param {Array<MODEL>} inputs An array of inputs
	    @returns {void}
	*/
	addInputs(inputs) {
        if (inputs) {
            inputs.forEach((i) => this.addInput(i));
		}
    }
    /** Adds the input to the PROMPT 
        @param {MODEL} input An input model
        @returns {void} 
    */
    addInput(input) {
        let inp = null;
        if (input.type === 'FORMPOSTINPUT') {
            this.promptInputs.push(new FORMPOSTINPUT(this.form.children[0].children[0].body.pane, input));
        } else {
            this.promptInputs.push(new FORMINPUT(this.form.children[0].children[0].body.pane, input));
        }
        this.form.children[0].children[0].children.push(inp);
    }
	/** Adds the provided buttons to the prompt
	    @param {Array} buttons An array of buttons
	    @returns {void}
	*/
	addButtons(buttons) {
        if (buttons) {
            buttons.forEach((btn) => this.form.footer.buttonGroup.addButton(btn[0], btn[1], btn[2]));
		}
	}
}
export { DIALOG };