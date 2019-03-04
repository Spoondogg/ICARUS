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
		super(node, 'SECTION', model, ['TEXTBLOCK', 'FORM']);
		this.addClass('section');
    }
    constructElements() {
        return this.callback(() => {
            if (this.dataId > 0) {
                this.createEditableElement('header', this.body.pane);
            } else {
                console.log('No data exists for ' + this.className);
                this.navheader.el.dispatchEvent(new Expand(this));
            }
        });
    }
}
export { MODEL }