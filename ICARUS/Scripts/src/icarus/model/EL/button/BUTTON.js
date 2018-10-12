/**
    @module
*/
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import GLYPHICON from '../span/GLYPHICON.js';
/**
    A generic Bootstrap button    
    @class
    @extends EL
*/
export default class BUTTON extends EL {
	/**
	    @param {EL} node The parent object
	    @param {string} label The label
	    @param {string} glyphicon The glyphicon (optional)
	    @param {string} buttonType The type of button ie: [button, reset, submit]
	 */
	constructor(node, label, glyphicon, buttonType = 'BUTTON') {
		super(node, 'BUTTON', new MODEL(new ATTRIBUTES({
			'class': 'btn glyphicon',
			'type': buttonType
		})));
		this.icon = new GLYPHICON(this, label, glyphicon);
	}
	/**
		    Sets the label within the button to the given string
		    @param {string} label A button label
		    @param {string} glyphicon Glyphicon string or ICON.ENUM
	        @returns {void}
		 */
	setLabel(label, glyphicon) {
		this.icon.label.setInnerHTML(label);
		if (glyphicon) {
			this.icon.setIcon(glyphicon);
		}
	}
}