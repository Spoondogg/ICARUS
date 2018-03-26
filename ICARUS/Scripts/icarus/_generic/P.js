﻿/**
    A paragraph of text
*/
class P extends EL {
    /**
        Constructs a Paragraph
        @param {EL} node The object to contain this element
        @param {MODEL} model The object
        @param {string} innerHtml Inner HTML within this paragraph
     */
    constructor(node, model, innerHtml){
        super(node, 'P', model, model.innerHtml || innerHtml);
    }
}