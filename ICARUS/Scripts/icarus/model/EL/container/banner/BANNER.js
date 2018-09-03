/**
    A banner that can be populated with CallOuts
*/
import CONTAINER from '../CONTAINER.js';
export class BANNER extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['CALLOUT','THUMBNAIL']);
        this.body.pane.addClass('banner');
        this.body.pane.addClass('noselect');
        this.populate(model.children);
    }

    construct() {

    }
}