/**
    @module
*/
import CONTAINER from '../../CONTAINER.js';
import GLYPHICON from '../../../span/GLYPHICON.js';
import HEADER from '../../../header/HEADER.js';
import MODEL from '../../../../MODEL.js';
import P from '../../../p/P.js';
/**
    A panel with an icon and some text
    @class
    @extends CONTAINER
*/
export default class CALLOUT extends CONTAINER {
	/**
	    Constructs a Bootstrap Jumbotron.
	    @param {CONTAINER} node The model
	     @param {MODEL} model Object Model
	 */
	constructor(node, model) {
		super(node, 'DIV', model);
		this.setClass('col-lg-4'); // Override icarus-container 
		this.body.pane.addClass('callout');
		//this.populate(model.children);
	}
	construct() {
		if (this.dataId > 0) {
			if (this.data.icon) {
				this.icon = new GLYPHICON(this.body.pane, this.data.icon);
			}
			if (this.data.header) {
				this.header = new HEADER(this.body.pane, new MODEL().set({
					'label': this.data.header
				}), 3);
				if (this.data.align) {
					this.header.el.setAttribute('style', 'text-align:' + this.data.align + ';');
				}
			}
			if (this.data.p) {
				//this.hr = new HR(this.body.pane, new MODEL());
				this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(this.data.p));
			}
		}
	}
}