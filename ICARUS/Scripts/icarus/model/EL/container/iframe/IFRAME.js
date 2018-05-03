/**
    Jumbotron / Hero unit Constructor
*/
class IFRAME extends CONTAINER {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        //this.body.pane.el.setAttribute('style', 'width:100%;height:300px;border:0;');
        //this.body.pane.el.setAttribute('frameborder', 0);

        this.frame = new EL(this, 'IFRAME', new MODEL(
            new ATTRIBUTES({
                'width': '100%',
                'height': 300,
                'border': 0,
                'frameborder': 0
            })
        ));

        if (model.dataId > 0) {
            if (model.data.src) {
                this.frame.el.setAttribute('src', model.data.src);
            }
        }

        this.populate(model.children);
    }
}