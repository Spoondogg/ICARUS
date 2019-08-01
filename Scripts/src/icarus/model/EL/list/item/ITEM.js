/** @module */
import EL, { ATTRIBUTES, MODEL } from '../../EL.js';
import { MODELS } from '../../../../enums/DATAELEMENTS.js';
/** An abstract List Item Constructor
    @class
    @extends EL
*/
export default class ITEM extends EL {
	/** Constructs a List Item
	    @param {EL} node Node
	    @param {TextModel} [model] Model
        @param {string} [element] HTML Element Tag
	*/
	constructor(node, model = MODELS.text(), element = 'LI') {
		super(node, element, model);
	}
}
export { ATTRIBUTES, EL, MODEL }