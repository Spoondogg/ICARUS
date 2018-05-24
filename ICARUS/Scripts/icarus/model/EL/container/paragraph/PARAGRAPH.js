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

        if (model.dataId > 0) {
            if (model.data.text) {
                this.p = new P(this.body.pane, new MODEL(), this.htmlDecode(model.data.text));
                //this.body.pane.setInnerHTML(model.data.text);
            }
        }

        this.addContainerCase('IMAGE');
        this.populate(model.children);
    }
}