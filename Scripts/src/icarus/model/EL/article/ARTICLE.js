/** @module */
import CONTAINER, { Activate, MODEL } from '../container/CONTAINER.js'; //, { ATTRIBUTES, EL, MODEL }
import SPAN from '../span/SPAN.js';
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
        return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('header', this.body.pane);
                let date = this.getDateCreated();
                this.articleDate = new SPAN(this.body.pane, new MODEL('date-created').set('innerHTML', date.date));
                this.articleAuthor = new SPAN(this.body.pane, new MODEL('author').set('innerHTML', this.authorId));
            }
            this.navheader.tab.el.dispatchEvent(new Activate(this.navheader.tab));
        });
    }
}
export { MODEL }