/** @module */
import CONTAINER, { MODEL } from '../container/CONTAINER.js';
/** A generic SECTION within an ARTICLE
    @class
    @extends CONTAINER
*/
export default class SECTION extends CONTAINER {
	/** Constructs a SECTION Container Element
	    @param {CONTAINER} node Node
	    @param {ContainerModel} [model] Model
    */
	constructor(node, model) {
        super(node, 'SECTION', model, ['SECTION', 'TEXTBLOCK', 'FORM', 'TABLE', 'FORMPOSTINDEX', 'CONTAINERINDEX', 'IMAGEINDEX']);
        this.addClass('section');
        this.deactivateSiblingsOnActivate = false;
	}
	constructElements() {
		return this.chain(() => {
			if (this.dataId > 0) {
                this.createEditableElement('header', this.childLocation);
                if (parseInt(this.data.showHeader) === 1) {
                    this.createEditableElement('p', this.childLocation);
                }
			}
		});
	}
}
export { MODEL }