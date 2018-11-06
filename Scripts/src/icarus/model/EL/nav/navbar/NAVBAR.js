/** @module */
import MODEL from '../../../MODEL.js';
import NAV from '../NAV.js';
import NAVHEADER from '../menu/NAVHEADER.js';
/** A full width collapseable NAV Element
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
		this.addClass('collapse');
		this.menu = new NAVHEADER(this, new MODEL().set({
			label: node.label
		}));
    }
    /** Collapses the NAV
	    @returns {boolean} true if hidden
	    @returns {void}
	*/
    collapse() {
        try {
            $(this.el).collapse('hide');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    /** Expands the NAV
        @returns {void}
    */
    show() {
        try {
            $(this.el).collapse('show');
        } catch (e) {
            console.warn(e);
        }
    }
}
export { NAVHEADER };