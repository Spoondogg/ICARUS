/**
    An OPTIONS menu that appears within the NAVHEADER
 */
class NAVHEADEROPTIONS extends NAVITEMGROUP {

    /**
     * An Options Tab and its corresponding ModalMenu
     * @param {EL} node Parent
     * @param {MODEL} model Object
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-nav-right pull-right');

        // Modal Dependency Issues
        //this.modal = new MODALMENU('ModalMenu', 'A Modal Menu');

        this.modal = null;

        // THIS NEEDS TO BECOME A MODALMENU
        this.menu = new DROPDOWNMENU(this, new MODEL(
            new ATTRIBUTES({
                'style':'display:none;'
            })).set({
            'name': 'menu'
        }));

        //this.tab = new DROPDOWNTAB(this, new MODEL(
        this.tab = new NAVITEMTAB(this, new MODEL(
            new ATTRIBUTES({
                'class': 'pull-right',
                'name': 'tab'
            })
        ).set({
            'anchor': new MODEL().set({
                'label': 'Options'
            })
        }));
        this.tab.anchor.addClass('pull-right');
        this.tab.anchor.el.onclick = function () {
            this.tab.toggleClass();
            //$(this).toggleClass('active');
            this.menu.toggleClass();
        }.bind(this);

        

        this.tab.anchor.el.onclick = function () {
            console.log('Toggle Options Menu');

            let testItems = [
                new MODEL().set({
                    'element': 'NAVITEM',
                    'label': 'BUTTON ONE',
                    'icon': ICON.COG
                }),

                new MODEL().set({
                    'element': 'NAVITEM',
                    'label': 'BUTTON TWO',
                    'icon': ICON.COG
                }),

                new MODEL().set({
                    'element': 'NAVITEM',
                    'label': 'BUTTON THREE',
                    'icon': ICON.COG
                })
            ];

            this.modal = new MODALMENU(
                'Options', 'An Options Menu',
                this.menu.children, true
            );

            this.modal.show();
        }.bind(this);

        ////////////////
        // Create appropriate groups and buttons in the options dropdown
        this.menu.addNavItemGroup(
            new MODEL().set({
                'label': 'ELEMENTS',
                'name': 'ELEMENTS'
            })
        );

        this.menu.addNavItemGroup(
            new MODEL().set({
                'label': 'CRUD',
                'name': 'CRUD'
            })
        );

        this.menu.addNavItemGroup(
            new MODEL().set({
                'label': 'USER',
                'name': 'USER'
            })
        );

        this.addNavItemGroup(
            new MODEL().set({
                'label': 'DOM',
                'name': 'DOM'
            })
        );
    }
}