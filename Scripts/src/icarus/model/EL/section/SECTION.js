/** @module */
import CONTAINER, { Expand, MODEL } from '../container/CONTAINER.js';
/** A generic SECTION within an ARTICLE
    @class
    @extends CONTAINER
*/
export default class SECTION extends CONTAINER {
	/** Constructs a SECTION Container Element
	    @param {CONTAINER} node Node
	    @param {MODEL} model Model
    */
	constructor(node, model) {
		super(node, 'SECTION', model, ['SECTION', 'TEXTBLOCK', 'FORM']);
        this.addClass('section');
        this.deactivateSiblingsOnActivate = false;
	}
	constructElements() {
		return this.chain(() => {
			if (this.dataId > 0) {
                this.createEditableElement('header', this.body.pane);
                if (parseInt(this.data.showHeader) === 1) {
                    this.createEditableElement('p', this.body.pane);
                }
			} else {
                console.log('No data exists for ' + this.toString());
				this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
		});
	}
}
export { MODEL }