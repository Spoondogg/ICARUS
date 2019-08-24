/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A generic footer that should be placed at the bottom of content
    @class
    @extends EL
*/
export default class FOOTER extends EL {
	/** Constructs a generic footer.
	    @param {EL} node Node
	    @param {MODEL} [model] Model
	*/
	constructor(node, model) {
		super(node, 'FOOTER', model);
	}
}
export { ATTRIBUTES, EL, MODEL }