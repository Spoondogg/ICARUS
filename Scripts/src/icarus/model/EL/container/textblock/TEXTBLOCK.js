/** @module */
import CONTAINER, { DATAELEMENTS, MODEL } from '../CONTAINER.js';
import DIV from '../../div/DIV.js';
import P from '../../p/P.js';
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
		this.body.pane.addClass('container'); // col-lg-offset-2 col-lg-8
		//this.dataElements = ['text'];
		this.dataElements = DATAELEMENTS.TEXTBLOCK;
		this.row = new DIV(this.body.pane, new MODEL('row'));
		this.col = new DIV(this.row, new MODEL('col-lg-offset-2 col-lg-8'));
		if (model.dataId > 0) {
			this.text = new P(this.col, model.data, model.data.text);
		}
		this.populate(model.children);
	}
}