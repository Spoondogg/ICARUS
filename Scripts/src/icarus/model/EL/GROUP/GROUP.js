/** @module */
import Switchable, { ATTRIBUTES, AbstractMethodError, Activate, Deactivate, EL, MODEL, MissingContainerError, RecursionLimitError } from '../../../interface/Switchable.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
/** A group acts as a named, Switchable element used for grouping items
    @class
*/
export default class GROUP extends EL {
	/** Construct a Switchable named Element for grouping items
        @param {EL} node Node
        @param {string} element HTMLElement Tag name
        @param {MODEL} model Model
    */
	constructor(node, element, model = MODELS.group()) {
        super(node, element, model);
		this.implement(new Switchable(this));
	}
}
export { AbstractMethodError, Activate, ATTRIBUTES, Deactivate, EL, GROUP, MissingContainerError, MODEL, RecursionLimitError }