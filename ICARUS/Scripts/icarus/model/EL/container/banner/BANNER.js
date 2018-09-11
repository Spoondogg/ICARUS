import CONTAINER from '../CONTAINER.js';
/**
    A horizontal container designed to be
    populated with self contained objects
*/
export default class BANNER extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model, ['CALLOUT','THUMBNAIL']);
        this.body.pane.addClass('banner');
        this.populate(model.children);
    }

    construct() {

    }
}