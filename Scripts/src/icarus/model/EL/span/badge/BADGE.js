/** @module */
import SPAN, { MODELS } from '../SPAN.js';
/** A bootstrap badge, typically contained within a list-item
    @class
*/
export default class BADGE extends SPAN {
	/** Construct a Badge Element
	    @param {EL} node Node
	    @param {TextModel} model Model
	*/
	constructor(node, model = MODELS.text()) {
        super(node, model);
        this.addClass('badge');
	}
}