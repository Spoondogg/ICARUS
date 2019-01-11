/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import Collapsible from '../../../interface/Collapsible/Collapsible.js';
import Switchable from '../../../interface/Switchable/Switchable.js';
/** A collapsible, switchable group of items
    @class
    @extends EL
*/
export default class GROUP extends EL {
	/** Construct a group of elements that is Switchable and Collapsible
        @param {EL} node The element that will contain this object
        @param {string} element HTML Element 
        @param {MODEL} model The json object representing this element
    */
    constructor(node, element, model = new MODEL()) {
        //console.log('group', node, element, model);
        if (typeof model.name !== 'string') {
            model.name = element + '_' + model.id;
        }
        super(node, element, model);
        //console.log('group super complete');
        this.implement(new Switchable(this));
        this.implement(new Collapsible(this));
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