/** @module */
import DIV, { EL, MODEL } from '../div/DIV.js';
import CONTAINER from '../container/CONTAINER.js';
import Collapsible from '../../../interface/Collapsible/Collapsible.js';
import PANE from './PANE.js';
/** A collapsible DIV with an embedded PANE
    @class
    @extends DIV
*/
export default class COLLAPSIBLE extends DIV {
	/** Construct a collapsible DIV with an embedded PANE
        @param {CONTAINER} node Parent
        @param {MODEL} model Object
	*/
	constructor(node, model) {
		super(node, model);
        this.implement(new Collapsible(this));
        this.pane = new PANE(this, new MODEL());
        this.expand();
	}
}
export { CONTAINER, EL, MODEL };