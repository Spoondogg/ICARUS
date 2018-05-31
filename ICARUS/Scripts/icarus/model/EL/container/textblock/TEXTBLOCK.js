/**
    Textblock Constructor
    A TEXTBLOCK is essentially a DIV that is designed to contain
    rich text (paragraph and span with formatting attributes) and images.

    A textblock can be recursively stacked

    @param {EL} node The object to contain this element
    @param {MODEL} model The textblock
    @param {number} depth The heirarchy for header elements, classes etc
*/
class TEXTBLOCK extends CONTAINER {
    constructor(node, model, depth) {
        super(node, 'DIV', model);
        this.addClass('textblock');

        this.body.pane.addClass('container'); // col-lg-offset-2 col-lg-8

        this.dataElements = ['text'];

        this.row = new EL(this.body.pane, 'DIV', new MODEL(new ATTRIBUTES('row')));
        this.col = new EL(this.row, 'DIV', new MODEL(new ATTRIBUTES('col-lg-offset-2 col-lg-8')));

        if (model.dataId > 0) {
            this.text = new P(this.col, model.data, model.data.text);
        }
        
        this.populate(model.children);
    }
}