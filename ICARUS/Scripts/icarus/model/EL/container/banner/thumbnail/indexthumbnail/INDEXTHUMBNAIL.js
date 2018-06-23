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
        this.setClass('col-xs-4 col-sm-4 col-md-4 col-lg-offset-0');
        //this.construct();
        //this.populate(model.children);
    }

    /**
     * Creates the Modal that contains the list of objects for preview
     * TODO: Consider paging these results
     */
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

        this.modal.container.preview = new CONTAINER(this.modal.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES('preview')), [this.data.listClass.toUpperCase()]);
        this.modal.container.preview.el.setAttribute('style', 'height:400px;max-height:400px;overflow-y:auto;');

        this.modal.container.menulist = new MENULIST(
            this.modal.container.body.pane,
            new MODEL(
                new ATTRIBUTES({
                    'style':'max-height:200px;overflow-y:auto;'
                })
            ).set({
            'name': 'preview-list',
            'label': this.data.listClass + '(s)'
        }));


        for (let li = 0; li < this.data.list.length; li++) {

            let title = this.data.list[li].label + ' (' + this.data.listClass + '[' + this.data.list[li].id + '])';
            
            this.modal.container.menulist.menu.addNavItem(new MODEL().set({
                'label': title
            })).el.onclick = function () {
                this.modal.container.preview.body.pane.empty();
                this.launchPreview(
                    500, title,
                    this.modal.container.preview.body.pane,
                    this.data.listClass,
                    this.data.list[li].id
                );
            }.bind(this);

        }
        this.modal.show();
    }

    /**
     * Creates a modal and loads the specified container
     * @param {any} delay Delay in milliseconds
     * @param {any} title Modal Title
     * @param {any} node Modal node
     * @param {any} className Object class name
     * @param {any} id Object id
     */
    launchPreview(delay = 500, title = 'Preview', node, className, id) {
        setTimeout(function () {
            $.getJSON('/' + className + '/Get/' + id, function (result) {
                console.log(className+':');
                console.log(result);
                this.modal.container.preview.create(result.model);
            }.bind(this));
        }.bind(this), delay);

        setTimeout(function () {
            $.getJSON('/' + className + '/GetContainerParents/' + id, function (result) {
                console.log(className + ' Parents:');
                console.log(result);                
            }.bind(this));
        }.bind(this), delay);

    }
}