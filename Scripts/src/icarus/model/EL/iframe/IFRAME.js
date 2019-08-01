/** @module */
import EL, { ATTRIBUTES, MODEL } from '../../el/EL.js';
/** An Inline Frame
    @deprecated
    @class
*/
export default class IFRAME extends EL {
	/** Constructs an iframe
	    @param {EL} node Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, 'IFRAME', model);
		this.el.setAttribute('border', 0);
		this.el.setAttribute('frameborder', 0);
		this.el.setAttribute('width', '100%');
		this.el.setAttribute('background-color', 'white');
	}
}
export { ATTRIBUTES, EL, MODEL }