/** @module */
import CONTAINER, { Expand, MODEL } from '../container/CONTAINER.js'; //, { ATTRIBUTES, EL, MODEL }
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
        if (this.dataId > 0) {
            this.createEditableElement('header', this.body.pane);
        } else {
            console.log('No data exists for ' + this.className);
            this.navheader.el.dispatchEvent(new Expand(this));
        }
    }
}
export { MODEL }