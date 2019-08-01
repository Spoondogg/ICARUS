/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
/** A CITE element
    @class
    @extends EL
*/
export default class CITE extends EL {
	/** Constructs a CITE element
	    @param {EL} node Node
	    @param {TextModel} model Model
    */
	constructor(node, model = MODELS.text()) {
		super(node, 'CITE', model);
	}
}
export { ATTRIBUTES, EL, MODEL }