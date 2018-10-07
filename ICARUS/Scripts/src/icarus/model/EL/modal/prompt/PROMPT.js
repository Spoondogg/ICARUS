/**
    A Prompt Modal module
    @module
*/
import FORM from '../../form/FORM.js';
import FORMINPUT from '../../container/formelement/forminput/FORMINPUT.js';
import FORMPOSTINPUT from '../../container/formelement/formpostinput/FORMPOSTINPUT.js';
import MODAL from '../MODAL.js';
/**
    A modal prompt
    @description Creates a modal and displays a text well and any included buttons
    @class
    @extends MODAL
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
		super(label, text, vertical);
		this.addClass('prompt');
		this.form = FORM.createEmptyForm(this.container.body.pane, false);
		this.form.prompt = this;
		this.promptInputs = [];
		this.addInputs(inputs);
		this.addButtons(buttons);
	}
	/**
	    Adds the provided inputs to the prompt
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
					this.promptInputs.push(new FORMPOSTINPUT(this.formElementGroup.body.pane, inputs[i]));
				} else {
					this.promptInputs.push(new FORMINPUT(this.formElementGroup.body.pane, inputs[i]));
				}
				this.formElementGroup.children.push(inp);
			}
		}
	}
	/**
	    Adds the provided buttons to the prompt
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
export { MODAL };