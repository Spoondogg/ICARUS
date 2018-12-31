/** @module */
import CONTAINER from '../CONTAINER.js';
import LISTITEM from './listitem/LISTITEM.js';
/** A UL Container that is designed to contain List Items (LI)
    @class
    @extends CONTAINER    
*/
export default class LIST extends CONTAINER {
	/** Constructs An Unordered List
	    @param {EL} node Parent Node
	    @param {MODEL} model Object MODEL
	*/
	constructor(node, model) {
		super(node, 'UL', model, ['LISTITEM']);
		this.addClass('list');
    }
    /** Perform any async actions and populate this Container
        @param {Array<MODEL>} children Array of elements to add to this container's body
        @returns {Promise<ThisType>} callback
    */
    construct(children) {
        return this.populate(children).then(() => this.ifEmpty());
    }
	/** Adds a List Item (LI) to this LIST
	    @param {MODEL} model List Item Model
	    @returns {LISTITEM} A list item
	*/
	addListItem(model) {
		this.children.push(new LISTITEM(this, model)); //model.url, model.label
		return this.addGroup(this.children[this.children.length - 1]);
	}
}
export { LISTITEM }