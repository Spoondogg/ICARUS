/**
    @module
*/
import LI, { ANCHOR, ATTRIBUTES, EL, MODEL } from '../li/LI.js';
import GROUP from '../group/GROUP.js';
/**
    A generic unorganized list
    @class
    @extends GROUP
*/
export default class UL extends GROUP {
/**
    Constructs an Unordered List
    @param {EL} node The node to contain this element
    @param {MODEL} model The element model
 */
constructor(node, model) {
super(node, 'UL', model);
/* Add cases for each relevant constructor that inherited class does not have 
		this.addCase('UL', () => { // model
			return this.addUnorderedList(model);
		});
		this.addCase('LI', (model) => {
			return this.addListItem(model);
        });*/
this.addCase('UL', () => this.addUnorderedList(model));
this.addCase('LI', () => this.addListItem(model));
}
/**
    Construct a generic List Item (LI) and append to this element's children
    @param {MODEL} model Object Model
    @returns {LI} A list item LI
 */
addListItem(model) {
this.children.push(new LI(this, model, model.label));
return this.children[this.children.length - 1];
}
/**
    Construct an unordered List (UL) and append to this element's children
    @param {MODEL} model Object Model
    @returns {LI} A list item LI
 */
addUnorderedList(model) {
this.children.push(new UL(this, model));
return this.children[this.children.length - 1];
}
}
export { ANCHOR, ATTRIBUTES, EL, GROUP, LI, MODEL };