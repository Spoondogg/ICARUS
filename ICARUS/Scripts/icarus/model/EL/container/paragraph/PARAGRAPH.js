/**
    A banner that can be populated with CallOuts
*/
class PARAGRAPH extends CONTAINER {
    /**
        Constructs a Banner that contains CallOuts.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.body.pane.addClass('paragraph');


        this.addContainerCase('IMAGE');
        this.populate(model.children);
    }
}