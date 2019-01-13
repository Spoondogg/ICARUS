/** @module */
import MENU, { NAVITEM, NAVITEMICON } from '../menu/MENU.js';
import NAV, { EL, MODEL } from '../NAV.js';
import Collapsible from '../../../../interface/Collapsible/Collapsible.js';
import { ICONS } from '../../../../enums/ICONS.js';
import SVG from '../../svg/SVG.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable/Switchable.js';
/** A full width collapseable NAV Element
    @class
    @extends NAV
*/
export default class NAVBAR extends NAV {
	/** Constructs a Navigation Panel
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
        super(node, model);
        this.addClass('navbar');
        this.implement(new Switchable(this));
        this.implement(new Collapsible(this));

        this.logo = new SVG(this, '0 0 32 32', '', '#CCC');
        this.tabs = new MENU(this, new MODEL('tabs').set('name', 'tabs')); // @todo Should be its own class Horizontal Menu?
        this.tabs.activate();
        this.tabs.list.expand();
        this.menus = new MENU(this, new MODEL('menus').set('name', 'menus'));
        this.menus.activate();
        this.menus.list.expand();

        this.addTabbableElement(
            this.tabs.addNavItemIcon(new MODEL('pull-right').set({
                icon: ICONS.COG,
                name: 'OPTIONS'
            })),
            this.menus.addMenu(new MODEL().set('name', 'OPTIONS'))
        );

        //this.tab = this.tabs.addNavItem(new MODEL('wide-tab').set('label', model.label)); // Container should create this!!
        //this.optionsTab = this.tabs.addNavItemIcon(new MODEL('pull-right').set('icon', ICONS.COG));
        
        //this.menu = new MENU(this, new MODEL('main-menu').set('name', 'menu')); // Main Menu..?
        //this.optionsTab.el.addEventListener('activate', () => this.menu.activate());
        //this.optionsTab.el.addEventListener('deactivate', () => this.menu.deactivate());
        //this.addOptionsMenu();

        //this.activate();
        //this.expand();
    }
    /** Adds a Tab and associated Menu
         @param {NAVITEM} tab NAV Item that acts as a Tab
         @param {EL} element A Switchable Element that is activated by this Tab
         @returns {void}
    */
    addTabbableElement(tab, element) {
        tab.el.addEventListener('activate', () => element.el.dispatchEvent(new Activate())); //.activate());
        tab.el.addEventListener('deactivate', () => element.el.dispatchEvent(new Deactivate())); //.deactivate());
    }
    /** Adds the Options/Config menu to the NavHeader.
        Adds a right aligned tab to show/hide the Options Menu
        @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
        @returns {void}
    */
    addOptionsMenu() {
        try {
            ['OPTIONS', 'ELEMENTS', 'CRUD', 'DOM'].forEach((name) => this.menu.addMenu(new MODEL('horizontal collapse').set({
                name,
                collapsed: 1, // Do not remove these!
                showHeader: 1
            })));
        } catch (e) {
            let modal = this.getProtoTypeByClass('MODAL');
            if (modal === null) {
                console.warn('Unable to retrieve MAIN Container', e);
                throw e;
            } else {
                switch (modal.className) {
                    case 'LOADER':
                    case 'PROMPT':
                        break;
                    default:
                        console.warn(this.className + ' exists inside an unrecognized Modal window.', modal);
                        break;
                }
            }
        }
    }
}
export { EL, MODEL };