/** @module */
import CONTAINER from '../container/CONTAINER.js';
/** A generic SECTION within an ARTICLE
    @class
    @extends CONTAINER
*/
export default class SECTION extends CONTAINER {
	/** Constructs a SECTION Container Element
	    @param {ARTICLE} node The ARTICLE to contain the section
	    @param {MODEL} model The SECTION object retrieves from the server
    */
	constructor(node, model) {
        super(node, 'SECTION', model, ['FORM']);
        this.addClass('section');
    }
    /** Perform any async actions and populate this Container
        @param {Array<MODEL>} children Array of elements to add to this container's body
        @returns {Promise<ThisType>} callback
    */
    construct(children) {
        return this.populate(children).then(() => this.ifEmpty());
    }
}