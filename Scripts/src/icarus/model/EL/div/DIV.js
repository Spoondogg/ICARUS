/** @module */
import EL, {
	ATTRIBUTES,
	MODEL
} from '../EL.js';
/** A DIV element
    @class
    @extends EL
*/
export default class DIV extends EL {
	/** Constructs a DIV element
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	    @param {string} innerHtml Inner Html
	*/
	constructor(node, model, innerHtml) {
		super(node, 'DIV', model, innerHtml);
	}
}
export {
	ATTRIBUTES,
	EL,
	MODEL
};