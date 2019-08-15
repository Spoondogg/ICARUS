/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
/** A BLOCKQUOTE element
    @class
*/
export default class BLOCKQUOTE extends EL {
	/** Constructs a BLOCKQUOTE element
	    @param {EL} node Node
	    @param {TextModel} model Model
	 */
	constructor(node, model = MODELS.text()) {
		super(node, 'BLOCKQUOTE', model);
	}
}
export { ATTRIBUTES, EL, MODEL }