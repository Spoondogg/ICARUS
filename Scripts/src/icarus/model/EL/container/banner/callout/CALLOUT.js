/** @module */
import CONTAINER, { MODELS } from '../../CONTAINER.js';
import GLYPHICON from '../../../span/GLYPHICON.js';
/** A panel with an icon and some text
    @class
    @extends CONTAINER
*/
export default class CALLOUT extends CONTAINER {
	/** Constructs a Callout
	    @param {CONTAINER} node Node
	    @param {ContainerModel} model Model
    */
	constructor(node, model) {
        super(node, 'DIV', model);
        this.setAttribute('class', 'col-lg-4');
		this.body.pane.addClass('callout');
	}
	construct() {
		return this.chain(() => {
			if (this.dataId > 0) {
				if (this.data.icon) {
                    this.icon = new GLYPHICON(this.childLocation, MODELS.icon(this.data.icon));
				}
				if (this.data.header) {
                    this.createEditableElement('header', this.childLocation).then((header) => {
						if (this.data.align) {
							header.el.setAttribute('style', 'text-align:' + this.data.align + ';');
						}
					});
				}
				if (this.data.p) {
                    this.createEditableElement('p', this.childLocation);
				}
			}
		});
	}
}