/** @module */
import Collapsible, { Collapse, Expand, Toggle } from '../../../interface/Collapsible.js';
import DIV, { ATTRIBUTES, EL, MODEL } from '../div/DIV.js';
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
	}
}
export { ATTRIBUTES, Collapsible, Collapse, DIV, EL, Expand, MODEL, Toggle }