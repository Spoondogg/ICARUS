/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
/** A STRONG element
    @class
    @extends EL
*/
export default class STRONG extends EL {
	/** Constructs a STRONG element
	    @param {EL} node Node
	    @param {TextModel} model Model
	*/
	constructor(node, model = MODELS.text()) {
		super(node, 'STRONG', model);
	}
}
export { ATTRIBUTES, EL, MODEL }