/** @module */
import CONTAINER, { ATTRIBUTES, COLLAPSIBLE, Clickable, DATA, Expand, MODEL, MODELS, SPAN, Toggle } from '../container/CONTAINER.js';
/** A generic ARTICLE Element
    @class
*/
export default class ARTICLE extends CONTAINER {
	/** Construct an ARTICLE
	    @param {CONTAINER} node Node
	    @param {ContainerModel} model Model
	*/
	constructor(node, model) {
        super(node, 'ARTICLE', model, ['JUMBOTRON', 'FORM', 'SECTION', 'TEXTBLOCK', 'TABLE', 'FORMPOSTINDEX', 'CONTAINERINDEX', 'IMAGEINDEX', 'INDEX']);
        this.addClass('article');
        this.deactivateSiblingsOnActivate = false;
        this.containerHeader = new COLLAPSIBLE(this.childLocation, 'DIV', new MODEL('header'));
	}
	constructElements() {
		return this.chain(() => {
            if (this.dataId > 0) {                
                this.createEditableElement('header', this.childLocation);
				let date = this.getDateCreated();
                new SPAN(this.containerHeader.pane, MODELS.text(new ATTRIBUTES(), DATA.text(date.date))).addClass('date-created').then(
                    (articleDate) => {
                        this.articleDate = articleDate;
                    }
                );
                new SPAN(this.containerHeader.pane, MODELS.text(new ATTRIBUTES(), DATA.text(this.authorId))).addClass('author').then(
                    (articleAuthor) => {
                        articleAuthor.implement(new Clickable(articleAuthor));
                        articleAuthor.el.addEventListener('longclick', () => {
                            if (this.getUser() === this.authorId || this.shared === 1) {
                                this.navheader.el.dispatchEvent(new Toggle(this.navheader));
                            }
                        });
                        this.articleAuthor = articleAuthor;
                    }
                );

                if (parseInt(this.data.showHeader) === 1) {
                    this.containerHeader.el.dispatchEvent(new Expand(this.containerHeader));
                }
			}
		});
	}
}
export { MODEL }