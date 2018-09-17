/**
    @module
*/
import THUMBNAIL from '../THUMBNAIL.js';
import '../../../../../../StringMethods.js';
/**
    A thumbnail with a preview window and a list of Containers
    that can be loaded into the preview
    @class
    @extends THUMBNAIL
*/
export default class INDEXTHUMBNAIL extends THUMBNAIL {
    /**
        Constructs a Bootstrap Jumbotron.
        @param {CONTAINER} node The model
        @param {MODEL} model Object Model
     */
    constructor(node, model) {
        super(node, model);
        this.setClass('col-xs-12 col-vs-6 col-sm-6 col-md-4 col-lg-offset-0');
        //this.construct();
        //this.populate(model.children);
    }

    /**
     * Creates the Modal that contains the list of objects for preview
     * TODO: Consider paging these results
     */
    launchModal() {
        DEBUG.log('Launch Index Thumbnail Modal');

        this.modal = new MODAL(this.data.header);
        this.modal.container.body.pane.addClass('thumbnail index-thumbnail');
        

        this.modal.container.image = new IMG(this.modal.container.body.pane, new MODEL());
        this.modal.container.image.el.src = this.image.el.src;

        this.modal.container.header = new HEADER(this.modal.container.body.pane, new MODEL().set({
            'label': this.data.header
        }));

        this.modal.container.p = new P(this.modal.container.body.pane, new MODEL(new ATTRIBUTES({
            'style': 'height:auto;'
        })), this.data.p);

        this.modal.container.previewNotes = new EL(this.modal.container.body.pane, 'DIV', new MODEL(new ATTRIBUTES({
            'class': 'preview-notes'
        })), '');

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
     * @param {number} delay Delay in milliseconds
     * @param {string} title Modal Title
     * @param {EL} node Modal node to append to
     * @param {string} className Object class name
     * @param {number} id Object id
     */
    launchPreview(delay = 500, title = 'Preview', node, className, id) {
        setTimeout(function () {
            $.getJSON('/' + className + '/Get/' + id, function (result) {
                console.log(className+':');
                console.log(result);
                this.modal.container.preview.create(result.model);
            }.bind(this));
        }.bind(this), delay);

        // Get a list of Parents for this Container
        // TODO: Do something with this, please!
        setTimeout(function () {
            $.getJSON('/' + className + '/GetContainerParents/' + id, function (result) {
                console.log(className + ' Parents:');
                console.log(result); 
                console.log(result.length + ' parent Containers');
                //this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
                this.modal.container.previewNotes.el.innerHTML = 'Parent Containers: ' + result.length;
            }.bind(this));
        }.bind(this), delay);
    }
}