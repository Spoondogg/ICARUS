/**
    Jumbotron with centered icon and text
*/
class INDEXTHUMBNAIL extends THUMBNAIL {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
         @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, model);
        //this.construct();
        //this.populate(model.children);
    }

    launchPreview(delay = 500, title = 'Preview') {
        setTimeout(function () {
            let modal = new MODAL(title);
            modal.show();
        }, delay);
    }

    launchModal() {
        console.log('Launch Index Thumbnail Modal');

        this.modal = new MODAL(this.data.header);
        this.modal.container.body.pane.addClass('thumbnail');

        this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL());
        this.modal.container.image.el.src = this.image.el.src;

        this.modal.container.header = new HEADER(this.modal.container.body.pane, new MODEL().set({
            'label': this.data.header
        }));

        this.modal.container.p = new P(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
            'style': 'height:auto;'
        })), this.data.p);

        this.modal.container.list = new LIST(this.modal.container.body.pane, new MODEL());
        for (let li = 0; li < this.data.list.length; li++) {
            let l = new LI(this.modal.container.list, new MODEL());
            l.a = new ANCHOR(l, new MODEL().set({
                'label': 'Preview ' + this.data.listClass + '['+this.data.list[li]+']'
            }));

            l.a.el.onclick = function () {
                let title = this.data.listClass + '[' + this.data.list[li] + ']';
                console.log('TODO: Load a preview of ' + title);
                //this.modal.hide(500);
                this.launchPreview(500, title);
                
            }.bind(this);
        }
        this.modal.show();
    }
}