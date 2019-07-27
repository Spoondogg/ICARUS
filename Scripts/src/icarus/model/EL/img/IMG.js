/** @module */
import EL from '../EL.js';
/** An image (IMG) Element
    @class
    @extends EL
*/
export default class IMG extends EL {
	/** Constructs an IMAGE element
	    @param {EL} node Node
	    @param {ImageModel} model Model
	*/
	constructor(node, model) {
		super(node, 'IMG', model);
	}
}