/** @module */
import CONTAINER from '../container/CONTAINER.js';
/** A generic SECTION within an ARTICLE
    @class
    @extends CONTAINER
*/
export default class SECTION extends CONTAINER {
	/**
	    Constructs a SECTION Container Element
	    @param {ARTICLE} node The ARTICLE to contain the section
	    @param {MODEL} model The SECTION object retrieves from the server
    */
	constructor(node, model) {
		super(node, 'SECTION', model, ['FORM']);
		this.populate(model.children);
	}
    construct() {
        return Promise.resolve(this);
    }
}