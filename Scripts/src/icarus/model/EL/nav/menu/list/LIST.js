/** @module */
import UL, { EL, LI, MODEL } from '../../../ul/UL.js';
import Collapsible from '../../../../../interface/Collapsible/Collapsible.js';
/** List Constructor
    @description A Collection of ListItems
    @class
    @extends UL
*/
export default class LIST extends UL {
	/** Constructs A Collection of ListItems
	    @param {EL} node Parent Node
	    @param {MODEL} model Object MODEL
	*/
    constructor(node, model) {
        super(node, model);
        this.addClass('list');
        this.implement(new Collapsible(this));
    }
}
export { EL, LI, MODEL, UL };