/** @module */
import CONTAINER from '../../CONTAINER.js';
import GLYPHICON from '../../../span/GLYPHICON.js';
//import HEADER from '../../../header/HEADER.js';
//import MODEL from '../../../../MODEL.js';
//import P from '../../../p/P.js';
/** A panel with an icon and some text
    @class
    @extends CONTAINER
*/
export default class CALLOUT extends CONTAINER {
	/** Constructs a Bootstrap Jumbotron.
	    @param {CONTAINER} node The model
	    @param {MODEL} model Object Model
    */
	constructor(node, model) {
		super(node, 'DIV', model);
		this.setClass('col-lg-4');
        this.body.pane.addClass('callout');
	}
    construct() {
        return new Promise((resolve, reject) => {
            try {
                if (this.dataId > 0) {
                    if (this.data.icon) {
                        this.icon = new GLYPHICON(this.body.pane, this.data.icon);
                    }
                    if (this.data.header) {
                        this.createEditableElement('header', this.body.pane).then((header) => {
                            if (this.data.align) {
                                header.el.setAttribute('style', 'text-align:' + this.data.align + ';');
                            }
                        });
                    }
                    if (this.data.p) {
                        this.createEditableElement('p', this.body.pane);
                    }
                }
                resolve(this);
            } catch (e) {
                reject(e);
            }
        });
	}
}