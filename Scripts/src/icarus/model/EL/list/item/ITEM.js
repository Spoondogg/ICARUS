/** @module */
import EL, { ATTR, ATTRIBUTES, DATA, MODEL } from '../../EL.js';
import { MODELS } from '../../../../enums/DATAELEMENTS.js';
/** An abstract List Item Constructor
    @class
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
export { ATTR, ATTRIBUTES, DATA, EL, MODEL }