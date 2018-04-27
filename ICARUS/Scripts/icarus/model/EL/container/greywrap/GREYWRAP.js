/**
    Jumbotron with centered icon and text
*/
class GREYWRAP extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('greywrap');
        this.addContainerCase('CALLOUT');
        this.populate(model.children);
    }
}