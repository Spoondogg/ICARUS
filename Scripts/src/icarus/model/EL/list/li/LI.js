/** @module */
import LIST, { ATTRIBUTES, EL, ITEM, MODEL } from '../LIST.js';
/** List Item Constructor
    @class
    @extends ITEM
*/
export default class LI extends ITEM {
	/** Constructs a List Item
	    @param {LIST} node Node
	    @param {TextModel} [model] Model
	*/
	constructor(node, model) {
		super(node, model, 'LI');
	}
}
export { ATTRIBUTES, EL, LIST, MODEL }