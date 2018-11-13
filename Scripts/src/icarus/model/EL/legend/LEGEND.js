/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** Legend Constructor
    @class
    @extends EL
*/
export default class LEGEND extends EL {
	/** Constructs a Fieldset Legend
	    @param {EL} node The legend fieldset
	    @param {MODEL} model The element's attributes
    */
	constructor(node, model) {
		super(node, 'LEGEND', model, model.label);
	}
}
export { ATTRIBUTES, EL, MODEL };