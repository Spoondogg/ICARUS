/** @module */
import EL, {
	MODEL
} from '../EL.js';
import GLYPHICON from '../span/GLYPHICON.js';
import SPAN from '../span/SPAN.js';
/** A generic BUTTON Element with an Icon and Label
    @class
    @extends EL
*/
export default class BUTTON extends EL {
	/** Construct a generic Button
	    @param {EL} node The parent object
	    @param {string} label The label
	    @param {string} glyphicon The glyphicon (optional)
	    @param {string} buttonType The type of button ie: [button, reset, submit]
	*/
	constructor(node, label, glyphicon, buttonType = 'BUTTON') {
		super(node, 'BUTTON', new MODEL());
		this.addClass('btn glyphicon');
		this.attributes.set('type', buttonType);
		this.icon = new GLYPHICON(this, glyphicon);
		this.label = new SPAN(this, new MODEL('button-label'), label);
	}
	/** Sets the label within the button to the given string
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