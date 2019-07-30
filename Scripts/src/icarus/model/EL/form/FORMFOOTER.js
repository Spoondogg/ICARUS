/** @module */
import BUTTONGROUP, { BUTTON, MODELS } from '../group/buttongroup/BUTTONGROUP.js';
import FOOTER, { EL, MODEL } from '../footer/FOOTER.js';
import { ALIGN } from '../../../enums/ALIGN.js';
/** A generic footer that should be placed at the bottom of content
    @class
    @extends FOOTER
*/
export default class FORMFOOTER extends FOOTER {
	/** Constructs a Form Footer
	    @param {EL} node Node
	    @param {FormFooterModel} [model] Model
	*/
	constructor(node, model = MODELS.formfooter()) {
		super(node, model);
		this.addClass('form-footer');
        this.buttonGroup = new BUTTONGROUP(this, MODELS.buttongroup('', model.align, 'form-buttons'));
	}
}
export { ALIGN, BUTTON, BUTTONGROUP, EL, FOOTER, MODEL }