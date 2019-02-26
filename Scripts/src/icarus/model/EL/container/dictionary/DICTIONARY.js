/** @module */
import CONTAINER from '../../container/CONTAINER.js';
/** A collection of words
    @class
    @extends CONTAINER
*/
export default class DICTIONARY extends CONTAINER {
	/** Construct a DICTIONARY Container
	    @param {MAIN} node The APP to contain the article
	    @param {MODEL} model The text that is displayed within the footer
	*/
	constructor(node, model) {
		super(node, 'DIV', model, ['WORD']);
	}
}