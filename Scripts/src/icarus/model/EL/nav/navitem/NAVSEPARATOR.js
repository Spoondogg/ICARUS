/** @module */
import NAVITEM, { ATTR, DATA, MODEL, MODELS } from '../navitem/NAVITEM.js';
/** A horizontal line that separates content inside a vertical menu
    @class
*/
export default class NAVSEPARATOR extends NAVITEM {
	/** A separator for menus
	    @param {EL} node The element that will contain this object
        @param {string} label Label
	*/
	constructor(node, label = '') {
        super(node, MODELS.navitem(ATTR.navitem(), DATA.navitem(label)));
        this.addClass('divider');
	}
}
export { MODEL }