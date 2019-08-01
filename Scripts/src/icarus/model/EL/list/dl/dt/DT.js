/** @module */
import ITEM, { MODEL } from '../../item/ITEM.js';
/** List Item Constructor
    @class
*/
export default class DT extends ITEM {
	/** Constructs a Definition Term (DT) for a Definition List
	    @param {DL} node Node
	    @param {TextModel} [model] Model
	*/
	constructor(node, model) {
        super(node, model, 'DT');
	}
}
export { MODEL }