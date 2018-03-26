/**
    An OPTIONS menu that appears within the NAVHEADER
 */
class NAVHEADEROPTIONS extends NAVITEMGROUP {

    /**
     * 
     * @param {EL} node Parent
     * @param {MODEL} model Object
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-nav-right pull-right');

        this.tab = this.addDropDownTab(
            new MODEL(
                new ATTRIBUTES({
                    'class': 'pull-right',
                    'name': 'tab'
                })
            ).set({                    
                'label': 'Options'
            })
        );

        this.tab.anchor.el.onclick = function () {
            console.log('Toggle Options Menu');
        };

        ////////////////
        // Create appropriate groups and buttons in the options dropdown
        this.tab.menu.addNavItemGroup(
            new MODEL().set({
                'label': 'ELEMENTS',
                'name': 'ELEMENTS'
            })
        );

        this.tab.menu.addNavItemGroup(
            new MODEL().set({
                'label': 'CRUD',
                'name': 'CRUD'
            })
        );

        this.tab.menu.addNavItemGroup(
            new MODEL().set({
                'label': 'USER',
                'name': 'USER'
            })
        );

        this.tab.addNavItemGroup(
            new MODEL().set({
                'label': 'DOM',
                'name': 'DOM'
            })
        );
    }
}