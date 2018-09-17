/**
    @module
*/
import EL, { MODEL } from '../EL.js';
import BUTTONGROUP from '../group/buttongroup/BUTTONGROUP.js';
/**
    A generic header that should be placed at the top of content    
    @class
    @extends EL
*/
export default class HEADER extends EL {
    /**
        Constructs a Header.
        @param {EL} node The object to contain the header
        @param {MODEL} model Object model
        @param {number} depth Headers can range from H1 to H6. Undefined returns a standard HEADER element
     */
    constructor(node, model, depth) {
        super(
            node,
            depth ? 'H' + depth : 'HEADER',
            model,
            model.label || ''
        );
        this.depth = depth || 0;

        if (dev) {
            this.el.ondblclick = this.edit.bind(this);
        }
    }

    /**
        Adds a button group to this header
        @param {string} className The class
        @returns {BUTTONGROUP} A new ButtonGroup instance
    */
    addButtonGroup(className) {
        return new BUTTONGROUP(this, className);
    }
}