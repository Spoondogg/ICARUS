/**
    Jumbotron with centered icon and text
*/
class THUMBNAIL extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.setClass('col-xs-12 col-sm-6 col-md-4 col-lg-offset-0'); // Override icarus-container 

        this.body.pane.addClass('thumbnail');

        if (model.dataId > 0) {
            if (model.data.img) {
                this.image = new EL(this.body.pane, 'IMG', new MODEL(new ATTRIBUTES({
                    'src': model.data.img
                })));
            }
            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': model.data.header
            }));
            this.text = new P(this.body.pane, new MODEL(), model.data.text);
            //this.footer = new FOOTER(this.body.pane, new MODEL());
        }

        this.populate(model.children);
    }
}