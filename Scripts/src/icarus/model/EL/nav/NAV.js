/** @module */
import EL, { MODEL } from '../EL.js';
/** Generic NAV Element 
    @class
    @extends EL
*/
export default class NAV extends EL {
	/** Constructs a NAV
	    @param {EL} node The element that will contain this object
	    @param {MODEL} model The object attributes
	*/
	constructor(node, model) {
		super(node, 'NAV', model);
    }
}
export { EL, MODEL }