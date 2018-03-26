/**
 * Containers have a 'body' that can contain an optional sidebar
 */
class CONTAINERBODY extends EL {
    /**
        Construct a body with an optional sidebar
         @param {CONTAINER} node Parent
         @param {MODEL} model Object
     */
    constructor(node, model) {
        super(node, 'DIV', model);
        this.addClass('container-body collapse');

        // Optional SIDEBAR (NAVITEMGROUP)
        this.sidebar = new SIDEBAR(this,
            new MODEL(new ATTRIBUTES('pull-left')).set({
                'name': 'sidebar',
                'label': 'SideBar'
            })
        );
        if (model.hasSidebar) {
            this.sidebar.addClass('active');
        }

        // The pane is the main viewing area of a Container.  
        this.pane = new EL(this, 'DIV',
            new MODEL(
                new ATTRIBUTES({
                    'class': 'pane pull-right'
                })
            )
        );
    }

    /**
        Toggle the collapsed state of this container
     */
    collapse() {
        $(this.el).collapse('toggle');
    }
}