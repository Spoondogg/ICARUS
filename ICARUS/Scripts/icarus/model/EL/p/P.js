import EL from '../EL.js';
/**
    A paragraph of text
*/
export default class P extends EL {
    /**
        Constructs a Paragraph
        @param {EL} node The object to contain this element
        @param {MODEL} model The object
        @param {string} innerHtml Inner HTML within this paragraph
     */
    constructor(node, model, innerHtml){
        super(node, 'P', model, model.innerHtml || innerHtml);
        if (dev) {
            this.el.ondblclick = this.edit.bind(this);
        }
    }
}