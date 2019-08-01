/** @module */
import ITEM, { MODEL } from '../../item/ITEM.js';
/** Definition Description Item Constructor
    @class
*/
export default class DD extends ITEM {
	/** Constructs a Definition Description (DD) for a Definition List
	    @param {DL} node Node
	    @param {TextModel} model Model
	*/
	constructor(node, model) {
        super(node, model, 'DD');
	}
}
export { MODEL }