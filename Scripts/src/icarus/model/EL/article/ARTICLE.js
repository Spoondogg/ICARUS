/** @module */
import CONTAINER, { Activate, COLLAPSIBLE, Expand, MODEL } from '../container/CONTAINER.js';
//import DIV from '../div/DIV.js';
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
        this.articleHeader = new COLLAPSIBLE(this.body.pane, new MODEL('header'));
	}
	constructElements() {
		return this.chain(() => {
            if (this.dataId > 0) {                
				this.createEditableElement('header', this.body.pane);
				let date = this.getDateCreated();
                this.articleDate = new SPAN(this.articleHeader.pane, new MODEL('date-created').set('innerHTML', date.date));
                this.articleAuthor = new SPAN(this.articleHeader.pane, new MODEL('author').set('innerHTML', this.authorId));
                this.articleHeader.el.dispatchEvent(new Expand(this.articleHeader));
			}
			this.navheader.tab.el.dispatchEvent(new Activate(this.navheader.tab));
		});
	}
}
export { MODEL }