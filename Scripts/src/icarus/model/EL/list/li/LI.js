/** @module */
import LIST, { ATTRIBUTES, EL, ITEM, MODEL } from '../LIST.js';
/** List Item Constructor
    @class
    @extends ITEM
*/
export default class LI extends ITEM {
	/** Constructs a List Item
	    @param {LIST} node Parent List
	    @param {MODEL} [model] The element's attributes
        param {string} element HTML Element Tag
	*/
	constructor(node, model) {
		super(node, model, 'LI'); // model.label
	}
}
export { ATTRIBUTES, EL, LIST, MODEL }