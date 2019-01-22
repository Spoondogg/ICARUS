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
}
export {
	MODEL
};