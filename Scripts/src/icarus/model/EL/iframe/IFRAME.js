/** @module */
import EL, { ATTRIBUTES, MODEL } from '../../el/EL.js';
/** An Inline Frame
    @deprecated
    @class
    @extends CONTAINER
*/
export default class IFRAME extends EL {
	/** Constructs an iframe
	    @param {EL} node Parent
	    @param {MODEL} model Object Model
	 */
	constructor(node, model) {
		super(node, 'IFRAME', model);
	}
	/** Adds borderless attributes to this element 
	    @returns {void}
	*/
	borderless() {
		this.attributes.set('border', 0);
		this.attributes.set('frameborder', 0);
	}
}
export { ATTRIBUTES, EL, MODEL };