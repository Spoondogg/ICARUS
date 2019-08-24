/** @module */
import P, { MODELS } from './P.js';
/** A block of text contained within a Well.
    @class
*/
export default class WELL extends P {
	/** Constructs a Well
	    @param {EL} node Node
	    @param {TextModel} model Model
	*/
	constructor(node, model = MODELS.text()) {
		super(node, model);
		this.addClass('well');
	}
}