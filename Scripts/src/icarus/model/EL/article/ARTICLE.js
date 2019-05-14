/** @module */
import CONTAINER, { Activate, COLLAPSIBLE, Clickable, Deactivate, Expand, MODEL, Toggle } from '../container/CONTAINER.js';
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
        this.deactivateSiblingsOnActivate = false;
        this.containerHeader = new COLLAPSIBLE(this.body.pane, new MODEL('header'));
	}
	constructElements() {
		return this.chain(() => {
            if (this.dataId > 0) {                
				this.createEditableElement('header', this.body.pane);
				let date = this.getDateCreated();
                this.articleDate = new SPAN(this.containerHeader.pane, new MODEL('date-created').set('innerHTML', date.date));
                this.articleAuthor = new SPAN(this.containerHeader.pane, new MODEL('author').set('innerHTML', this.authorId));
                this.articleAuthor.implement(new Clickable(this.articleAuthor));
                this.articleAuthor.el.addEventListener('longclick', () => {
                    if (this.getUser() === this.authorId || this.shared === 1) {
                        this.navheader.el.dispatchEvent(new Toggle(this.navheader));
                    }
                });

                if (parseInt(this.data.showHeader) === 1) {
                    this.containerHeader.el.dispatchEvent(new Expand(this.containerHeader));
                }
			}
		});
	}
}
export { MODEL }