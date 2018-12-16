/** @module */
import CONTAINER from '../container/CONTAINER.js'; //, { ATTRIBUTES, EL, MODEL }
/** A generic ARTICLE Element
    @class
    @extends CONTAINER
*/
export default class ARTICLE extends CONTAINER {
	/** Construct and ARTICLE
	    @param {MAIN} node The APP to contain the article
	    @param {MODEL} model The text that is displayed within the footer
	*/
	constructor(node, model) {
        super(node, 'ARTICLE', model, ['JUMBOTRON', 'SECTION']);
        this.addClass('article');
        this.populate(model.children);
        this.ifEmpty();
	}
    construct() { }
}