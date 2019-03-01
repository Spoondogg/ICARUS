/** @module */
import CONTAINER, {	Expand, MODEL } from '../CONTAINER.js'; // DATAELEMENTS
import DIV from '../../div/DIV.js';
/** Textblock Constructor
    @description A TEXTBLOCK is essentially a DIV that is designed to contain
    rich text (paragraph and span with formatting attributes) and images.
    @class
    @extends CONTAINER
*/
export default class TEXTBLOCK extends CONTAINER {
	/** Construct a block to contain text
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The textblock
	    param {number} depth The heirarchy for header elements, classes etc
    */
	constructor(node, model) { // depth
		super(node, 'DIV', model);
		this.addClass('textblock');
	}
    constructElements() {
        if (this.dataId > 0) {
            this.createEditableElement('header', this.body.pane);
            this.createEditableElement('p', this.body.pane);
            //this.text = new DIV(this.body.pane, new MODEL('text'), this.data.text);
            //this.text.el.ondblclick = () => this.save()
        } else {
            console.log('No data exists for ' + this.className);
            this.navheader.el.dispatchEvent(new Expand(this));
        }
    }
}
export { MODEL }