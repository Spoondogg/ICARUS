import EL from '../EL.js';
/**
    An image
*/
export default class IMG extends EL {
    /**
        Constructs a Paragraph
        @param {EL} node The object to contain this element
        @param {MODEL} model The object
     */
    constructor(node, model){
        super(node, 'IMG', model);
        if (dev) {
            this.el.ondblclick = this.edit.bind(this);
        }
    }
}