/** @module */
import BUTTONGROUP, { BUTTON } from '../group/buttongroup/BUTTONGROUP.js';
import { ALIGN } from '../../../enums/ALIGN.js';
import FOOTER from '../footer/FOOTER.js';
/** A generic footer that should be placed at the bottom of content
    @class
    @extends FOOTER
*/
export default class FORMFOOTER extends FOOTER {
	/** Constructs a Form Footer
	    @param {EL} node The object to contain the table
	    @param {MODEL} model Object model
	*/
	constructor(node, model) {
		super(node, model);
		this.addClass('form-footer');
		this.buttonGroup = new BUTTONGROUP(this, null, model.align); // Left aligned button group SIZE.MED
	}
}
export { ALIGN, BUTTON, BUTTONGROUP, FOOTER };