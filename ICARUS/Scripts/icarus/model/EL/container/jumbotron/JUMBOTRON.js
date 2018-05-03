/**
    Jumbotron / Hero unit Constructor
*/
class JUMBOTRON extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        this.body.pane.addClass('jumbotron');
        this.body.pane.addClass('noselect');

        if (model.dataId > 0) {
            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': model.data.header
            }), 1);

            if (model.data.text) {
                this.hr = new EL(this.body.pane, 'HR', new MODEL());
                this.text = new P(this.body.pane, new MODEL(), model.data.text);
            }
            
            if (model.data.bgImage) {
                this.body.pane.el.setAttribute('style',
                    'background: url(../Content/Images/' + model.data.bgImage + ');' //no-repeat center center
                );
                // no-repeat center center fixed
            }
        }

        this.populate(model.children);
    }
}