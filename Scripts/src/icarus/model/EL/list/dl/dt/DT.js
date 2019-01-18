/** @module */
import ITEM, { MODEL } from '../../item/ITEM.js';
/** List Item Constructor
    @class
    @extends ITEM
*/
export default class DT extends ITEM {
	/** Constructs a Definition Term (DT) for a Definition List
	    @param {DL} node Parent List
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, 'DT', model, model.label);
	}
}
export { MODEL }