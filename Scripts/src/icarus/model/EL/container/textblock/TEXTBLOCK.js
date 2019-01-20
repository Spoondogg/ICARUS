/** @module */
import CONTAINER, {
	MODEL
} from '../CONTAINER.js'; // DATAELEMENTS
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
	/** Override abstract method
	    @returns {void}
	*/
	construct() {
		return this.callback(() => {
			if (this.dataId > 0) {
				this.text = new DIV(this.body.pane, new MODEL('text'), this.data.text);
				this.text.el.ondblclick = () => this.save()
			}
		});
		/*return new Promise((resolve, reject) => {
		    try {
		        if (this.dataId > 0) {
		            this.text = new DIV(this.body.pane, new MODEL('text'), this.data.text);
		            this.text.el.ondblclick = () => this.save()
		        }
		        resolve(this);
		    } catch (e) {
		        reject(e);
		    }
		});*/
	}
}