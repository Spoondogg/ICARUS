/** @module */
import Collapsible, { Collapse, Expand } from '../../../interface/Collapsible.js';
import ITEM, { ATTRIBUTES, EL, MODEL } from './item/ITEM.js';
import LI from './li/LI.js';
import UL from './ul/UL.js';
/** List Constructor
    @description A Collection of ListItems
    @class
    @extends ITEM
*/
export default class LIST extends ITEM {
	/** Constructs an abstract Collapsible List
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
        @param {string} element HTML Element Tag
	*/
	constructor(node, model, element = 'UL') {
		super(node, model, element);
		this.addClass('list');
		this.implement(new Collapsible(this));
		this.addCallback('UL', () => this.addUL(model));
		this.addCallback('LI', () => this.addLI(model));
		this.el.addEventListener('collapse', () => {
			if (this.el.children.length > 0) {
				//console.log('TODO: EMPTYING ' + this.className + '[' + this.name + ']', this.className); //this
			}
		});
		this.el.addEventListener('expand', () => {
			//console.log('TODO: POPULATING ' + this.className + '[' + this.name + ']');
		});
	}
	/** Construct a generic List Item (LI) and append to this element's children
	    @param {MODEL} model Object Model
	    @returns {LI} A list item LI
	*/
	addLI(model) {
		return this.addChild(new LI(this, model, model.label));
	}
	/** Construct an unordered List (UL) and append to this element's children
	    @param {MODEL} model Object Model
	    @returns {UL} An Unordered List (UL)
	*/
	addUL(model) {
		return this.addChild(new UL(this, model));
	}
}
export { ATTRIBUTES, Collapse, Collapsible, EL, Expand, ITEM, LI, MODEL }