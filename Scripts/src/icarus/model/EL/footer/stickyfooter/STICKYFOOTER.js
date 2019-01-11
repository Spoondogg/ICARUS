/** @module */
import FOOTER, { EL } from '../FOOTER.js';
import Collapsible from '../../../../interface/Collapsible/Collapsible.js';
/** A Footer that sticks to bottom of page    
    @class
    @extends FOOTER
*/
export default class STICKYFOOTER extends FOOTER {
	/** Constructs a footer stuck to the bottom of the viewpane
	    @param {EL} node The object to contain the table
	    @param {MODEL} model stickyfooter model
	*/
	constructor(node, model) {
        super(node, model);
        this.addClass('stickyfooter');
        this.implement(new Collapsible(this));
	}
}
export { EL, FOOTER };