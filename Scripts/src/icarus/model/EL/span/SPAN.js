/** @module */
import EL, { ATTR, ATTRIBUTES, DATA, MODEL } from '../EL.js';
import { MODELS } from '../../../enums/MODELS.js';
/** A SPAN Element
    @class
*/
export default class SPAN extends EL {
	/** Constructs a simple SPAN Element
	    @param {EL} node Node
	    @param {TextModel} [model] Model
    */
	constructor(node, model = MODELS.text()) {
        super(node, 'SPAN', model);
        this.setInnerHTML(model.data.text);
	}
}
export { ATTR, ATTRIBUTES, DATA, EL, MODEL, MODELS, SPAN }