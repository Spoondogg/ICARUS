/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
/** A grouping of list items
    @class
    @extends EL
*/
export default class GROUP extends EL {
	/** Construct a group of NavItems
        @param {EL} node The element that will contain this object
        @param {string} element HTML Element 
        @param {MODEL} model The json object representing this element
    */
	constructor(node, element, model) {
        super(node, element, model);
        //this.setAttribute('role', 'group');
		try {
			if (model.name) {
				this.name = model.name; // Required
				this.el.setAttribute('name', model.name);
			}
		} catch (e) {
			console.log('Why is this happening? GROUP.js', this, e);
		}
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
		this.groups[group.name] = group;
		return this.groups[group.name];
	}
	/** Adds or Overrides the given group to this.groups
        @param {GROUP} group A GROUP Element
        @returns {GROUP} The given group
    */
	setGroup(group) {
		if (typeof this.groups[name] === 'undefined') {
			this.groups[group.name] = group;
		}
		return this.groups[group.name];
	}
}
export { ATTRIBUTES, EL, GROUP, MODEL };