/** @module */
import NAVITEM, { MODEL } from '../navitem/NAVITEM.js';
/** A horizontal line that separates content inside a vertical menu
    @class
    @extends NAVITEM
*/
export default class NAVSEPARATOR extends NAVITEM {
	/** A separator for menus
	    @param {EL} node The element that will contain this object
        @param {string} label Label
	*/
	constructor(node, label = '') {
        super(node, new MODEL('divider').set('label', label));
	}
}
export { MODEL }