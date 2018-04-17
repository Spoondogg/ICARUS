/**
    The header makes up the brand and expand button (on mobile views).
*/
class NAVHEADER extends NAVITEMGROUP {
    /**
        Construct a Nav Header.
        @param {EL} node The object that the navHeader is appended to
        @param {MODEL} model Object model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-header');
        
        // Left aligned group
        this.tabs = this.addNavItemGroup(
            new MODEL(
                new ATTRIBUTES({
                    'name': 'tabs',
                    'class': 'navbar-nav-left pull-left'
                }), 'tabs'
            ).set('name', 'tabs')
        );

        // Add a default tab to show/hide the collapse
        this.tab = this.tabs.addNavItem(
            new MODEL(
                new ATTRIBUTES({
                    //'class': 'navbar-brand',
                    'name': model.name,
                    'url': '#',
                    'title': model.element
                })
            ).set({
                'name': model.name,
                //'label': model.label,
                'anchor': new MODEL().set({
                    'label': model.label
                })
            })
        );

        // Right aligned group
        this.options = new NAVHEADEROPTIONS(this, new MODEL().set({
            'name': 'options'
        }));

        // A collapseable panel
        this.collapse = new NAVBARCOLLAPSE(this, new MODEL().set({
            'name': 'collapse'
        }));        
    }

    /**
        Show/Hide this.collapse
     */
    toggleCollapse() {
        console.log('NAVHEADER.toggleCollapse()');
        $(this.collapse.el).collapse('toggle');
    }
}