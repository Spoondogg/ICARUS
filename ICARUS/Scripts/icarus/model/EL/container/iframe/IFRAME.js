/**
    Inline Frame
*/
class IFRAME extends CONTAINER {
    /**
        Constructs an iframe
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);

        //this.body.pane.el.setAttribute('style', 'width:100%;height:300px;border:0;');
        //this.body.pane.el.setAttribute('frameborder', 0);

        this.frame = new EL(this.body.pane, 'IFRAME', new MODEL(
            new ATTRIBUTES({
                'width': '100%',
                'border': 0,
                'frameborder': 0,
                'style': 'height:calc(100vh - 142px);'
            })
        ));

        

        //this.populate(model.children);
    }

    construct() {
        if (this.data.src) {
            //this.frame.el.setAttribute('src', this.data.src);
        }
    }
}