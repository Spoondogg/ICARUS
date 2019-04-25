/** @module */
import CONTAINER, { Activate, COLLAPSIBLE, Expand, MODEL } from '../container/CONTAINER.js';
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
        this.containerHeader = new COLLAPSIBLE(this.body.pane, new MODEL('header'));
	}
	constructElements() {
		return this.chain(() => {
			if (this.dataId > 0) {
                this.createEditableElement('header', this.body.pane);
                this.createEditableElement('p', this.body.pane);
                if (this.data.showHeader === '1') {
                    this.containerHeader.el.dispatchEvent(new Expand(this.containerHeader));
                }
			} else {
                console.log('No data exists for ' + this.toString());
				this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
            //this.navheader.tab.el.dispatchEvent(new Activate(this.navheader.tab));
		});
	}
}
export { MODEL }