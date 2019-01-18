/** @module */
import ITEM, { ATTRIBUTES, EL, MODEL } from './item/ITEM.js';
import Collapsible from '../../../interface/Collapsible/Collapsible.js';
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
    }
    /** Construct a generic List Item (LI) and append to this element's children
	    @param {MODEL} model Object Model
	    @returns {LI} A list item LI
	*/
    addLI(model) {
        this.children.push(new LI(this, model, model.label));
        return this.children[this.children.length - 1];
    }
	/** Construct an unordered List (UL) and append to this element's children
	    @param {MODEL} model Object Model
	    @returns {UL} An Unordered List (UL)
	*/
    addUL(model) {
        this.children.push(new UL(this, model));
        return this.children[this.children.length - 1];
    }
    /** Get child element by Name
        @param {string} name Element Name
        @returns {Array<ITEM>} Child Item/Element Filtered Results
    */
    get(name) {
        return this.children.filter((ch) => ch.el.getAttribute('name') === name);
    }
}
export { ATTRIBUTES, Collapsible, EL, ITEM, LI, MODEL }