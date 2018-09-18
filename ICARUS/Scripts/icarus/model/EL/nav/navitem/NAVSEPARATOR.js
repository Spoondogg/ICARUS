/**
    @module
*/
import NAVITEM from '../navitem/NAVITEM.js';
import MODEL from '../../../MODEL.js';
/**
    A horizontal line that separates content inside a navbar dropdown menu
    @class
    @extends NAVITEM
*/
export default class NAVSEPARATOR extends NAVITEM {
	/**
	    A separator for menus
	    @param {EL} node The element that will contain this object
	 */
	constructor(node) {
		super(node, new MODEL('divider').set({
			'anchor': new MODEL().set({
				'label': ''
			})
		}));
	}
}