/**
    The header makes up the brand and expand button (on mobile views).
*/
class NAVHEADER extends MENU {
    /**
        Construct a Nav Header.
        @param {EL} node The object that the navHeader is appended to
        @param {MODEL} model Object model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-header');
        
        // Left aligned group
        this.tabs = new MENU(this, 
            new MODEL('navbar-nav-left pull-left').set({
                'name': 'tabs'
            })
        );

        // Add a default tab to show/hide the collapse
        this.tab = this.tabs.addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': model.label,
                    'url': '#'
                })
            })
        );

        // Right aligned group
        this.options = new MENU(this,
            new MODEL('navbar-nav-right pull-right').set({
                'name': 'options'
            })
        );
        
        if (user === 'Guest') {
            this.btnLogin = this.options.addNavItem(
                new MODEL().set({
                    'anchor': new MODEL('pull-right').set({
                        'icon': ICON.USER,
                        'label': '',
                        'url': '#'
                    })
                })
            ).el.onclick = function () {
                app.login();
            };
        }

        /**
         * Anything that references navHeader.menu will now require try/catch
         */
        if (dev) {

            /*
            this.btnLogout = this.options.addNavItem(
                new MODEL().set({
                    'anchor': new MODEL('pull-right').set({
                        'icon': ICON.USER,
                        'label': '',
                        'url': '#'
                    })
                })
            ).el.onclick = function () {
                app.logout();
            };
            */

            // Add a default tab to show/hide the Options Menu
            this.toggle = this.options.addNavItem(
                new MODEL(new ATTRIBUTES({
                    'style': 'width:100%;'
                })).set({
                    'anchor': new MODEL('pull-right').set({
                        'icon': ICON.COG,
                        'label': '', //Options
                        'url': '#'
                    })
                })
            ).el.onclick = this.toggleCollapse.bind(this);

            this.menu = new MENU(this, new MODEL('collapse').set({
                'name': 'menu'
            }));

            // Add Default OPTIONS groupings as HORIZONTAL menus
            let optionGroups = ['ELEMENTS', 'CRUD', 'USER', 'DOM'];
            for (let oG = 0; oG < optionGroups.length; oG++) {
                this.menu.addMenu(
                    new MODEL(new ATTRIBUTES('horizontal collapse')).set({
                        'name': optionGroups[oG],
                        'showHeader': 1,
                        'collapsed': 1
                    })
                );
            }
        }
    }

    /**
        Show/Hide this.menu
     */
    toggleCollapse() {
        console.log('NAVHEADER.toggleCollapse()');
        $(this.menu.el).collapse('toggle');
    }
}