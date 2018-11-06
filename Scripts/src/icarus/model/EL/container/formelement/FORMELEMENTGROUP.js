/** @module */
import CONTAINER, { ATTRIBUTES, EL, MODEL } from '../CONTAINER.js';
import FORMINPUT from './forminput/FORMINPUT.js';
import FORMPOSTINPUT from './formpostinput/FORMPOSTINPUT.js';
import FORMSELECT from './formselect/FORMSELECT.js';
import FORMTEXTAREA from './formtextarea/FORMTEXTAREA.js';
/** A container made up of a group of form elements
    @class
    @extends CONTAINER
*/
export default class FORMELEMENTGROUP extends CONTAINER {
	/** Constructs a Form Element Group
	    @param {EL} node The parent
	    @param {MODEL} model datamodel
    */
	constructor(node, model) {
		super(node, 'DIV', model, ['INPUT', 'SELECT', 'TEXTAREA']);
		this.addClass('form-element-group');
		this.populate(model.children);
	}
	construct() {}
	/** Adds the given array of input elements to this form element group
	    @param {FORMELEMENT} inputs A list of inputs
	    @returns {ThisType} Returns this FORMELEMENTGROUP
	*/
	addInputElements(inputs) {
		for (let i = 0; i < inputs.length; i++) {
			let inp = null;
			if (inputs[i].type === 'FORMPOSTINPUT' || inputs[i].attributes.type === 'FORMPOSTINPUT') {
				inp = new FORMPOSTINPUT(this.body.pane, inputs[i]);
			} else {
				switch (inputs[i].element) {
					case 'TEXTAREA':
						inp = new FORMTEXTAREA(this.body.pane, inputs[i]);
						break;
					case 'SELECT':
						inp = new FORMSELECT(this.body.pane, inputs[i]);
						break;
					default:
						inp = new FORMINPUT(this.body.pane, inputs[i]);
				}
			}
			this.children.push(inp);
		}
		return this;
	}
}
export { ATTRIBUTES, EL, FORMELEMENTGROUP, MODEL };