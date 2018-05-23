/**
    A banner that can be populated with CallOuts
*/
class BANNER extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.body.pane.addClass('banner');
        this.body.pane.addClass('noselect');

        this.addContainerCase('CALLOUT');
        this.addContainerCase('THUMBNAIL');
        this.populate(model.children);
    }
}