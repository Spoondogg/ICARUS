import EL from '../../EL.js';
/**
    List Item Constructor
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
}