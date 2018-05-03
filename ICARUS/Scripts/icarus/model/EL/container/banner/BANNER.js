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
        this.addClass('banner');
        this.addContainerCase('CALLOUT');
        this.addContainerCase('THUMBNAIL');
        this.populate(model.children);
    }
}