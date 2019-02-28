/** @module */
import CONTAINER, { MODEL } from '../container/CONTAINER.js'; //, { ATTRIBUTES, EL, MODEL }
/** A generic ARTICLE Element
    @class
    @extends CONTAINER
*/
export default class ARTICLE extends CONTAINER {
	/** Construct an ARTICLE
	    @param {CONTAINER} node Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, 'ARTICLE', model, ['JUMBOTRON', 'FORM', 'SECTION']);
		this.addClass('article');
    }
    constructElements() {
        console.log(this.className + '.constructElements()');
    }
}
export { MODEL }