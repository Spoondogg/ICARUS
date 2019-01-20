/** @module */
import ITEM, {
	MODEL
} from '../../item/ITEM.js';
/** Definition Description Item Constructor
    @class
    @extends EL
*/
export default class DD extends ITEM {
	/** Constructs a Definition Description (DD) for a Definition List
	    @param {DL} node Parent List
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, 'DD', model, model.label);
	}
	/** Construct an Description List (DL) and append to this element's children
	    @param {MODEL} model Object Model
	    @returns {DL} An Unordered List (UL)
	
    addDescriptionList(model) {
        this.children.push(new DL(this, model));
        return this.children[this.children.length - 1];
    }*/
}
export {
	MODEL
};