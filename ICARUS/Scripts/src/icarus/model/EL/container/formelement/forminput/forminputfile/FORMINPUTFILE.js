/**
    @module
*/
import FORMINPUT, { ATTRIBUTES, MODEL } from '../FORMINPUT.js'; // EL
import FORMTEXTAREA from '../../formtextarea/FORM9TEXTAREA.js';
/**
    A file INPUT element for a FORM Container
    @class
    @extends FORMINPUT
*/
export default class FORMINPUTFILE extends FORMINPUT {
	/**
	    Constructs an INPUT element
	    @param {EL} node Parent
	    @param {MODEL} model The model
	 */
	constructor(node, model) {
		super(node, new MODEL(new ATTRIBUTES({
			'type': 'FILE',
			'name': model.attributes.name
		})));
		/**
		    @property {TEXTAREA} base64 A textarea to hold a base64 encoded string
		*/
		this.base64 = new FORMTEXTAREA(this.body.pane, new MODEL().set({
			'name': 'base64'
		}));
		this.dataElements.push(new MODEL(new ATTRIBUTES({
			'name': 'accept',
			'type': 'text'
		})).set({
			'element': 'INPUT',
			'label': 'accept'
		}));
	}
}