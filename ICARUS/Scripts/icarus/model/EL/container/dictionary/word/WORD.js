/**
    Jumbotron / Hero unit Constructor
*/
class WORD extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.body.pane.addClass('word');
        //this.construct();
        //this.populate(model.children);
    }

    /**
     * Override abstract method
     */
    construct() {
        if (this.dataId > 0) {
            this.header = new HEADER(this.screen, new MODEL().set({
                'label': this.data.header
            }), 1);
        }
    }
}