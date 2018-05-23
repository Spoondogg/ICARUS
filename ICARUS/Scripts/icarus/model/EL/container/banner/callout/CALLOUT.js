/**
    Jumbotron with centered icon and text
*/
class CALLOUT extends CONTAINER { 
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.setClass('col-lg-4'); // Override icarus-container 

        this.body.pane.addClass('callout');

        if (model.dataId > 0) {            
            if (model.data.icon) {
                this.icon = new GLYPHICON(this.body.pane, '', this.htmlDecode(model.data.icon));
            }
            if (model.data.header) {
                this.header = new HEADER(this.body.pane, new MODEL().set({
                    'label': model.data.header
                }), 3);

                if (model.data.align) {
                    this.header.el.setAttribute('style', 'text-align:' + model.data.align+';');
                }

            }
            if (model.data.p) {
                this.p = new P(this.body.pane, new MODEL(), model.data.p);
            }
        }
        this.populate(model.children);
    }
}