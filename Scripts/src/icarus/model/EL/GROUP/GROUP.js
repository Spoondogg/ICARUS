/** @module */
//import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import Switchable, {
	ATTRIBUTES,
	Activate,
	Deactivate,
	EL,
	MODEL
} from '../../../interface/Switchable/Switchable.js';
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
		if (typeof model.name !== 'string') {
			model.name = element + '_' + model.id;
		}
		super(node, element, model);
		this.implement(new Switchable(this));
		this.name = this.required(model.name);
		this.setAttribute('name', this.name);
		this.groups = {};
	}
	/** Retrieves the specified group
        @param {string} name Name of group
        @returns {GROUP} A group
    */
	getGroup(name) {
		return this.groups[name];
	}
	/** Adds the given group to this.groups
        @param {GROUP} group A GROUP Element
        @returns {GROUP} The given group
    */
	addGroup(group) {
		if (typeof this.groups[name] === 'undefined') {
			this.groups[group.name] = group;
		}
		return this.groups[group.name];
	}
	/** Adds the given group to this.groups if it does not already exist
        @param {GROUP} group A GROUP Element
        @returns {GROUP} The given group
    */
	setGroup(group) {
		this.groups[group.name] = group;
		return this.groups[group.name];
	}
}
export {
	Activate,
	ATTRIBUTES,
	Deactivate,
	EL,
	GROUP,
	MODEL
};