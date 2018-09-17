/**
    @module
*/
import EL, { MODEL } from '../../EL.js';
import ANCHOR from '../../anchor/ANCHOR.js';
/**
    List Item Constructor
    @class
    @extends EL
*/
export default class LI extends EL {
    /**
        Constructs a List Item
        @param {UL} node The object to contain this element
        @param {MODEL} model The element's attributes
     */
    constructor(node, model) {
        super(node, 'LI', model, model.label);
    }
    /**
        Add an Anchor to this element
        @param {ANCHOR} model Anchor model
        @returns {MENU} The newly created element
     */
    addAnchor(model) {
        this.children.push(new ANCHOR(this, model));
        return this.children[this.children.length - 1];
    }
}