/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** Legend Constructor
    @class
    @extends EL
*/
export default class LEGEND extends EL {
	/** Constructs a Fieldset Legend
	    @param {EL} node Node
	    @param {MODEL} model Model
    */
	constructor(node, model) {
		super(node, 'LEGEND', model);
	}
}
export { ATTRIBUTES, EL, MODEL }