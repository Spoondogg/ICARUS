/** @module */
import EL, { MODEL } from '../EL.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
/** A Paragraph Element
    @class
    @extends EL
*/
export default class P extends EL {
	/** Constructs a Paragraph
	    @param {EL} node Node
	    @param {TextModel} [model] Model
	*/
	constructor(node, model = MODELS.text()) {
		super(node, 'P', model);
	}
}
export { MODEL }