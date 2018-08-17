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

        // Add a button to toggle sidebar (modify)
        this.btnSidebar = this.tabs.addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': '<',
                    'url': '#',
                    'icon': ICONS.ARROW_UP
                })
            })
        );
        this.btnSidebar.el.setAttribute('style', 'float:left;width:32px;background-color:#101010;overflow:hidden;');
        this.btnSidebar.el.onclick = function () {
            let container = this.getProtoTypeByClass('CONTAINER');

            let form = container.createEmptyForm(container.sidebar, false);

            container.toggleSidebar();
            //container.sidebar.el.innerHTML = 'Populate sidebar';



        }.bind(this);
        // Add a default tab to show/hide the collapse
        this.tab = this.tabs.addNavItem(
            new MODEL().set({
                'anchor': new MODEL().set({
                    'label': model.label,
                    'url': '#',
                    'icon': ICONS.PLUS
                })
            })
        );
        this.tab.el.setAttribute('style', 'float:left;width:calc(100% - 32px);clear:none;');

        this.tab.el.onclick = function () {
            this.getProtoTypeByClass("CONTAINER").toggleBody();
        }.bind(this);

        // Simulate LONG CLICK to edit the label
        this.tab.pressTimer;
        this.tab.el.onmousedown = function (ev) {
            this.tab.pressTimer = window.setTimeout(function () {
                console.log('Long Clicked ' + this.tab.anchor.label);
                //this.getProtoTypeByClass('CONTAINER').quickSave(true);
                this.getProtoTypeByClass('CONTAINER').toggleSidebar();
                ev.stopPropagation();
            }.bind(this), 1000);


        }.bind(this);

        this.tab.el.onmouseup = function (ev) {
            clearTimeout(this.tab.pressTimer);
            ev.stopPropagation();
            return false;
        }.bind(this);
        




        // Right aligned group
        this.options = new MENU(this,
            new MODEL('navbar-nav-right pull-right').set({
                'name': 'options'
            })
        );        

        if (user === 'Guest') {
            this.btnLogin = this.options.addNavItem(
                new MODEL().set({
                    'icon': ICONS.USER,
                    'anchor': new MODEL('pull-right').set({
                        'icon': ICONS.USER,
                        'label': '',
                        'url': '#'
                    })
                })
            ).el.onclick = function () {
                app.login();
            };
        } else {
            // Add a default tab to show/hide the Options Menu
            this.toggle = this.options.addNavItem(
                new MODEL(new ATTRIBUTES({
                    'style': 'width:100%;'
                })).set({
                    'anchor': new MODEL('pull-right').set({
                        'icon': ICONS.COG,
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