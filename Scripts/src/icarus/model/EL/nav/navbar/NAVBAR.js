/** @module */
import NAV, { EL, MODEL } from '../NAV.js';
import Collapsible from '../../../../interface/Collapsible/Collapsible.js'; //, { Expand }
import NAVHEADER from '../menu/NAVHEADER.js';
import Switchable from '../../../../interface/Switchable/Switchable.js';
/** A full width collapseable NAV Element
    @class
    @extends NAV
*/
export default class NAVBAR extends NAV {
	/** Constructs a Navigation Panel
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
        super(node, model);
        this.addClass('navbar');
        this.implement(new Switchable(this));
        this.implement(new Collapsible(this));
        //console.log('navbar menu');
        this.menu = new NAVHEADER(this, new MODEL('woot').set({
            label: model.label,
            name: model.label
        }));
        //console.log('navbar menu complete');
        this.menu.expand();
    }
}
export { EL, MODEL, NAVHEADER };