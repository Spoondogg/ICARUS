/** @module */
import LI, { ANCHOR, ATTRIBUTES, EL, MODEL } from '../li/LI.js';
import GROUP from '../group/GROUP.js';
/** A generic unorganized list that can be collapsed
    @class
    @extends GROUP
*/
export default class UL extends GROUP {
	/** Constructs an Unordered List
	    @param {EL} node The node to contain this element
	    @param {MODEL} model The element model
	*/
    constructor(node, model) {
        //console.log('ul', node, model);
        super(node, 'UL', model);
        //console.log('ul super complete');
        this.addClass('list');
		this.addCallback('UL', () => this.addUnorderedList(model));
		this.addCallback('LI', () => this.addListItem(model));
	}
	/** Construct a generic List Item (LI) and append to this element's children
	    @param {MODEL} model Object Model
	    @returns {LI} A list item LI
	*/
	addListItem(model) {
		this.children.push(new LI(this, model, model.label));
		return this.children[this.children.length - 1];
	}
	/** Construct an unordered List (UL) and append to this element's children
	    @param {MODEL} model Object Model
	    @returns {UL} An Unordered List (UL)
	*/
	addUnorderedList(model) {
		this.children.push(new UL(this, model));
		return this.children[this.children.length - 1];
	}
}
export { ANCHOR, ATTRIBUTES, EL, GROUP, LI, MODEL };