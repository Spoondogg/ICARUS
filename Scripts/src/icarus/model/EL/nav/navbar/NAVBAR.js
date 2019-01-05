/** @module */
//import Activate from '../../../../event/Activate.js';
//import Clickable from '../../../../interface/Clickable/Clickable.js';
import Collapsible from '../../../../interface/Collapsible/Collapsible.js';
import MODEL from '../../../MODEL.js';
import NAV from '../NAV.js';
import NAVHEADER from '../menu/NAVHEADER.js';
import Switchable from '../../../../interface/Toggleable/Toggleable.js';
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
		//this.addClass('collapse');
        this.menu = new NAVHEADER(this, new MODEL().set('label', node.label));
        this.implement(new Switchable(this));
        this.implement(new Collapsible(this));
        //this.flip(); // Test newly implemented clickable method bound to this
    }
}
export { NAVHEADER };