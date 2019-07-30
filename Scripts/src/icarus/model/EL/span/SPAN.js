/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
/** A SPAN Element
    @class
    @extends EL
*/
export default class SPAN extends EL {
	/** Constructs a simple SPAN Element
	    @param {EL} node Node
	    @param {TextModel} [model] Model
    */
	constructor(node, model = MODELS.text()) {
        super(node, 'SPAN', model);
        this.setInnerHTML(model.text);
	}
}
export { ATTRIBUTES, EL, MODEL, MODELS, SPAN }