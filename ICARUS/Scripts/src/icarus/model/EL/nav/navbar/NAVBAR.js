/** @module */
import MODEL from '../../../MODEL.js';
import NAV from '../NAV.js';
import NAVHEADER from '../menu/NAVHEADER.js';
/** A full width NAV Element with a NAVHEADER
    A navbar can be hidden because it is collapseable
    @see https://getbootstrap.com/docs/3.3/components/#nav
    @class
    @extends NAV
*/
export default class NAVBAR extends NAV {
	/** Constructs a Navigation Panel
	    @param {EL} node The element that will contain this object
	    @param {MODEL} model The object
	 */
	constructor(node, model) {
		super(node, model);
        this.addClass('navbar collapse');
		this.header = new NAVHEADER(this, new MODEL().set({
			'label': node.label
		}));
	}
}