/** @module */
import CONTAINER, { MODEL } from '../CONTAINER.js';
/** Textblock Constructor
    @description A TEXTBLOCK is essentially a DIV that is designed to contain
    rich text (paragraph and span with formatting attributes) and images.
    @class
    @extends CONTAINER
*/
export default class TEXTBLOCK extends CONTAINER {
	/** Construct a block to contain text
	    @param {EL} node Node
	    @param {ContainerModel} model Model
    */
	constructor(node, model) {
		super(node, 'DIV', model);
		this.addClass('textblock');
	}
	/** Override abstract method
	    @returns {void}
	*/
	construct() {
		return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('header', this.childLocation);
                this.createEditableElement('p', this.childLocation);
            }
		});
	}
}
export { MODEL }