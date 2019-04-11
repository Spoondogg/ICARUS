/** @module */
import Switchable, { ATTRIBUTES, AbstractMethodError, Activate, Deactivate, EL, MODEL, MissingContainerError, RecursionLimitError } from '../../../interface/Switchable.js';
/** A group acts as a named, Switchable element used for grouping items
    @class
    @extends EL
*/
export default class GROUP extends EL {
	/** Construct a Switchable named Element for grouping items
        @param {EL} node The element that will contain this object
        @param {string} element HTML Element 
        @param {MODEL} model The json object representing this element
    */
	constructor(node, element, model = new MODEL()) {
		/*if (typeof model.name !== 'string') {
			//model.name = element + '_' + model.id;
            console.warn('Group name not defined', model);
		}*/
		super(node, element, model);
		this.implement(new Switchable(this));
		/*if (typeof this.name === 'undefined') {
		    this.name = this.required(model.name || this.className);
		    this.setAttribute('name', this.required(model.name || this.className));
		}*/
	}
}
export { AbstractMethodError, Activate, ATTRIBUTES, Deactivate, EL, GROUP, MissingContainerError, MODEL, RecursionLimitError }