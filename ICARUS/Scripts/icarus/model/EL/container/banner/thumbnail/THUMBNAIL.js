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

        this.dataElements = ['img', 'header', 'text', 'bgImage'];

        if (this.dataId > 0) {
            if (this.data.img) {
                this.image = new EL(this.body.pane, 'IMG', new MODEL(new ATTRIBUTES({
                    'src': this.data.img
                })));
            }
            this.header = new HEADER(this.body.pane, new MODEL().set({
                'label': this.data.header
            }));
            this.text = new P(this.body.pane, new MODEL(), truncate(this.data.text, 128));
            //this.footer = new FOOTER(this.body.pane, new MODEL());
            this.buttonGroup = new BUTTONGROUP(this.body.pane, 'btn-block');
            this.button = this.buttonGroup.addButton('', ICON.CHEVRON_RIGHT);
            this.button.addClass('btn-block');

            this.button.el.onclick = function () {
                console.log('Launch Modal');

                let modal = new MODAL(model.data.header);
                modal.container.body.pane.addClass('thumbnail');
                modal.container.image = new EL(modal.container.body.pane, 'IMG', new MODEL(new ATTRIBUTES({
                    'src': this.data.img
                })));
                modal.container.header = new HEADER(modal.container.body.pane, new MODEL().set({
                    'label': this.data.header
                }));
                modal.container.text = new P(modal.container.body.pane, new MODEL(new ATTRIBUTES({
                    'style': 'height:auto;'
                })), this.data.text);

                modal.show();
            }.bind(this);
        }

        this.populate(model.children);
    }
}