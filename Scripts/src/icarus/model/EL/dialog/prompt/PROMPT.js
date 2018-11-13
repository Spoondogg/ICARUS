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
			vertical
		}));
		this.addClass('prompt');
		this.form = FORM.createEmptyForm(this.body, false);
		this.form.prompt = this;
		this.promptInputs = [];
		this.addInputs(inputs);
		this.addButtons(buttons);
	}
	/** Adds the provided inputs to the prompt
	    @param {Array} inputs An array of inputs
	    @returns {void}
	*/
	addInputs(inputs) {
		if (inputs) {
			for (let i = 0; i < inputs.length; i++) {
				//DEBUG.log('inputs[' + i + ']: ' + inputs[i].type);
				let inp = null;
				if (inputs[i].type === 'FORMPOSTINPUT') {
					//DEBUG.log('FORMPOSTINPUT');
					this.promptInputs.push(new FORMPOSTINPUT(this.form.children[0].children[0].body.pane, inputs[i]));
				} else {
					this.promptInputs.push(new FORMINPUT(this.form.children[0].children[0].body.pane, inputs[i]));
				}
				this.form.children[0].children[0].children.push(inp);
			}
		}
	}
	/** Adds the provided buttons to the prompt
	    @param {Array} buttons An array of buttons
	    @returns {void}
	*/
	addButtons(buttons) {
		if (buttons) {
			for (let b = 0; b < buttons.length; b++) {
				this.form.footer.buttonGroup.addButton(buttons[b][0], buttons[b][1], buttons[b][2]);
			}
		}
	}
}
export { DIALOG };