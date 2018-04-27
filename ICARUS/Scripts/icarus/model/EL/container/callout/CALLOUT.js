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


        this.icon = new GLYPHICON(this.body.pane, '', ICON.LOCK);
        if (model.dataId > 0) {            
            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': model.data.header
            }), 2);
            this.p = new P(this.body.pane, new MODEL(), model.data.p);
        } else {
            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': 'CALLOUT'
            }), 2);
            this.p = new P(this.body.pane, new MODEL(), 'Hello World');
        }
        

        this.populate(model.children);
    }
}