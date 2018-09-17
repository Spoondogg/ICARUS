/**
    @module
*/
import EL from '../EL.js';
/**
    A span (SPAN) Element
    @class
    @extends EL
*/
export default class SPAN extends EL {
    /**
        Constructs a blob of text in a SPAN
        @param {EL} node The object to contain this element
        @param {MODEL} model The object attributes
        @param {string} innerHtml The object contents (html)
     */
    constructor(node, model, innerHtml) {
        super(node, 'SPAN', model, innerHtml);
    }
}