/** @module */
import CONTAINER from '../container/CONTAINER.js'; //, { ATTRIBUTES, EL, MODEL }
/** A generic ARTICLE Element
    @class
    @extends CONTAINER
*/
export default class ARTICLE extends CONTAINER {
	/** Construct an ARTICLE
	    @param {MAIN} node The APP to contain the article
	    @param {MODEL} model The text that is displayed within the footer
	*/
	constructor(node, model) {
		super(node, 'ARTICLE', model, ['JUMBOTRON', 'SECTION']);
		this.addClass('article');
	}
	/** Perform any async actions and populate this Container
	    @param {Array<MODEL>} children Array of elements to add to this container's body
	    @returns {Promise<ThisType>} callback
	*/
	construct(children) {
		return this.populate(children).then(() => this.ifEmpty());
	}
}