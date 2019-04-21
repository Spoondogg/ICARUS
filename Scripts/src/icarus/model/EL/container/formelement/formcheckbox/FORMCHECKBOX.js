/** @module */
import FORMELEMENT, { ATTRIBUTES, EL, INPUTTYPES, MODEL } from '../FORMELEMENT.js';
import OPTION from '../../../option/OPTION.js';
import SELECT from '../../../select/SELECT.js';
//import STRING from '../../../../../STRING.js';
/** Represents an INPUT Checkbox for a Form    
    @class
    @extends FORMELEMENT
*/
export default class FORMCHECKBOX extends FORMELEMENT {
	/** An Input/Select OPTION constructor.
	    @param {EL} node Node
	    @param {string} model The Form Select model
	    @param {array} options A collection of key,value pairs
	*/
	constructor(node, model) {
		super(node, model);
		this.dataElements = ['options'];
		this.createSelect();
	}
	/** Creates the SELECT Element
        @returns {SELECT} A SELECT input Element
    */
	createSelect() {
		this.input = new SELECT(this.body.pane, new MODEL(new ATTRIBUTES({
			name: ('INPUT_' + String().guid()).friendly()
		})));
		if (this.dataId > 0) {
			let options = this.data.options.split(',');
			try {
				for (let o = 0; o < options.length; o++) {
					this.addOption(options[o], options[o]);
				}
			} catch (e) {
				console.log(e);
			}
		}
		return this.input;
	}
	/** Adds an OPTION to this SELECT
        @param {string} value The value
        @param {string} label The label	    
        @param {boolean} selected If true, option is selected
        @returns {void}
        @throws Throws an error if unable to create the OPTION element
    */
	addOption(value, label) {
		try {
			this.input.options.push(new OPTION(this.input, value, label));
		} catch (e) {
			throw e;
		}
	}
}
export { EL, INPUTTYPES, OPTION }