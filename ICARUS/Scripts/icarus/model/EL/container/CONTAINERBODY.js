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
        
        if (model.hasSidebar) {
            this.sidebar = new SIDEBAR(this,
                new MODEL(new ATTRIBUTES('pull-left')).set({
                    'name': 'sidebar',
                    'label': 'SideBar'
                })
            );        
            this.sidebar.addClass('active');
            this.sidebar.addClass('in');
        }

        // The pane is the main viewing area of a Container.  
        this.pane = new EL(this, 'DIV',
            new MODEL(
                new ATTRIBUTES({
                    'class': 'pane pull-right'
                })
            )
        );

        if (dev) {
            this.pane.el.ondblclick = function (e) {
                //node.toggleSidebar();
                app.loader.log('Launch Editor for ' + node.className + '(' + node.id + ')');
                $(node.navBar.header.menu.el).collapse('show');
                node.btnSave.el.click();
                debug('TODO: Focus Label');
                //save(node);
                // Prevent parent double click()
                e.stopPropagation();
            };
        }
    }

    /**
        Toggle the collapsed state of this container
     */
    collapse() {
        $(this.el).collapse('toggle');
    }
}