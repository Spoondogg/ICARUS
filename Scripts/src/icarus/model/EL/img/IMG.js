/**
    @module
*/
import EL from '../EL.js';
/**
    An image (IMG) Element
    @class
    @extends EL
*/
export default class IMG extends EL {
	/**
	    Constructs a Paragraph
	    @param {EL} node The object to contain this element
	    @param {MODEL} model The object
	 */
	constructor(node, model) {
		super(node, 'IMG', model);
		try {
			if (this.getMain().getDev()) {
				this.el.ondblclick = this.edit.bind(this);
			}
		} catch (e) {
			//console.warn('IMG does not have a MAIN Container', e);
		}
	}
}