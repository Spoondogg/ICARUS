/** @module */
import EL, { ATTR, ATTRIBUTES, DATA, MODEL } from '../EL.js';
import { MODELS } from '../../../enums/MODELS.js';
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
export { ATTR, ATTRIBUTES, DATA, EL, MODEL }