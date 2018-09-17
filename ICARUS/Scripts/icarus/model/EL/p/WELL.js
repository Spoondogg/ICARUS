/**
    @module
*/
import P from './P.js';

/**
    A block of text contained within a Well.
    @class
    @extends P
 */
export default class WELL extends P {
    /**
        Constructs a Well
        @param {EL} node The object to contain this element
        @param {MODEL} model The object
        @param {string} innerHtml Inner HTML within this paragraph
    */
    constructor(node, model, innerHtml) {
        super(node, model, innerHtml);
        this.addClass('well');
    }
}