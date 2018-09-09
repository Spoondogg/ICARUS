import MENU from '../menu/MENU.js';
import MODEL from '../../../MODEL.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import { ICONS } from '../../../../enums/ICONS.js';
/**
    An expandable menu with clickable header that opens a container full of icons
*/
export default class NAVHEADER extends MENU {
    /**
        Construct a Nav Header.
        @param {EL} node The object that the navHeader is appended to
        @param {MODEL} model Object model
     */
    constructor(node, model) {
        super(node, model);
        this.addClass('navbar-header');

        /**
            A container
            @type {CONTAINER}
        
        console.log('NavHeader getting Container', this.el);
        this.container = null; //this.getContainer(); //this.getProtoTypeByClass('CONTAINER');
        console.log('NavHeader Container', this.container);*/
        
        // Left aligned group
        this.tabs = new MENU(this, 
            new MODEL().set({
                'name': 'tabs'
            })
        );
        
        // Add a default tab to show/hide the collapse
        this.tab = this.tabs.addNavItem(
            new MODEL('pull-left').set({
                'anchor': new MODEL().set({
                    'label': model.label,
                    'url': '#',
                    'icon': ICONS.PLUS
                })
            })
        );

        this.tab.el.onclick = function () {
            this.getContainer().toggleBody();
        }.bind(this);

        // Simulate LONG CLICK to edit the label
        this.tab.pressTimer;
        this.tab.el.onmousedown = function (ev) {
            this.tab.pressTimer = window.setTimeout(function () {
                console.log('Long Clicked ' + this.tab.anchor.label);
                try {
                    let container = this.getContainer();
                    let main = container.getMainContainer();
                    main.sidebar.empty();
                    main.toggleSidebar();

                    container.save(main.sidebar);
                    main.target = container;
                } catch (e) {
                    console.log(e);
                }
                ev.stopPropagation();
            }.bind(this), 1000);
        }.bind(this);

        this.tab.el.onmouseup = function (ev) {
            clearTimeout(this.tab.pressTimer);
            ev.stopPropagation();
            return false;
        }.bind(this);

        // If the user is a 'Guest', show the Login Button        
        if (this.getUser() !== 'Guest') {

            // Add a default tab to show/hide the Options Menu
            this.toggle = this.tabs.addNavItem(
                new MODEL('pull-right').set({
                    'anchor': new MODEL().set({
                        'icon': ICONS.COG,
                        'label': '', //Options
                        'url': '#'
                    })
                })
            ).el.onclick = this.toggleCollapse.bind(this);

            // Create the submenu to be toggled
            this.menu = new MENU(this, new MODEL('collapse').set({
                'name': 'menu'
            }));

            // Add Default OPTIONS groupings as HORIZONTAL menus
            let optionGroups = ['ELEMENTS', 'CRUD', 'DOM']; //'USER'
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
     * Return the user or Guest if doesn't exist
     * @returns {string} User string
     */
    getUser() {
        let userVar;
        try {
            userVar = user;
        } catch (e) {
            userVar = 'Guest';
        }
        return userVar;
    }

    /**
        Show/Hide this.menu
     */
    toggleCollapse() {
        //console.log('NAVHEADER.toggleCollapse()');
        $(this.menu.el).collapse('toggle');
    }

    /**
        Sets the parent container for this Nav Header if it does not exist,
        then returns it or null
        @returns {CONTAINER} The parent container for this container
    */
    getContainer() {
        //console.log('NAVHEADER.getContainer()', this.container);
        if (this.container === undefined) {
            this.container = this.getProtoTypeByClass('CONTAINER');
        }
        return this.container;
    }
}