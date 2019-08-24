/** @module */
import Collapsible, { Collapse, Expand, Toggle } from '../../../interface/Collapsible.js';
import DIV, { ATTR, ATTRIBUTES, DATA, EL, MODEL } from '../div/DIV.js';
import PANE from './PANE.js';
/** A collapsible DIV with an embedded PANE
    @class
    @extends EL
*/
export default class COLLAPSIBLE extends EL {
	/** Construct a collapsible DIV with an embedded PANE
        @param {CONTAINER} node Parent
        @param {string} [element="DIV"] Element tag name
        @param {MODEL} [model] Model
	*/
	constructor(node, element = 'DIV', model) {
		super(node, element, model);
		this.implement(new Collapsible(this));
		this.pane = new PANE(this);
	}
}
export { ATTR, ATTRIBUTES, Collapsible, Collapse, DATA, DIV, EL, Expand, MODEL, Toggle }