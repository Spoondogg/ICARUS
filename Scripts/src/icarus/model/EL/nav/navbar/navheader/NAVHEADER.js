/** @module */
import NAVBAR, { ANCHOR, Activate, Collapse, Collapsible, Deactivate, EL, Expand, ICONS, LIST, MENU, MODEL, NAVITEM, NAVITEMICON } from '../NAVBAR.js';
import SIDEBAR from '../../../container/sidebar/SIDEBAR.js';
/** A NAVBAR that acts as a CONTAINER Header
    @class
    @extends NAVBAR
*/
export default class NAVHEADER extends NAVBAR {
	/** Constructs a NAVBAR that acts as a CONTAINER Header
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, model);
		this.addClass('nav-header');
		/** The CONTAINER Tab 
		    @todo Spoon.svg
		    @todo Consider moving into CONTAINER
		*/
		this.tab = this.tabs.addNavItemIcon(new MODEL('tab-wide').set({
			icon: ICONS.CERTIFICATE,
			label: model.label
		}));
		node.el.addEventListener('activate', () => this.tab.el.dispatchEvent(new Activate()));
		node.el.addEventListener('deactivate', () => this.tab.el.dispatchEvent(new Deactivate()));
		this.tab.el.addEventListener('activate', () => node.body.el.dispatchEvent(new Expand()));
		this.tab.el.addEventListener('deactivate', () => node.body.el.dispatchEvent(new Collapse()));
        this.addTabbableMenu('OPTIONS', 'OPTIONS', ICONS.COG, ['ELEMENTS', 'CRUD', 'DOM']);
	}
	/** Creates a NAVITEMICON with an associated MENU, then adds given secondary tabbable sub-menus
	    @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
        @param {string} name MENU Name
        @param {string} label TAB Label
        @param {string} icon TAB Icon
        @param {Array<string>} secondaryTabs Array of Tab names
	    @returns {{tab, element}} Tabbable Element with submenus {tab,element}
	*/
    addTabbableMenu(name, label = name, icon = ICONS.CERTIFICATE, secondaryTabs = []) {
        // Create Primary tab and Menu
        let tabbable = this.addTabbableElement(
            this.tabs.addNavItemIcon(new MODEL().set({
                icon,
                label
            })),
            this.menus.addMenu(new MODEL().set('name', name))
        );
		// Create Secondary Tabs and Horizontal Menus inside Menu            
        secondaryTabs.forEach((t) => this.addTabbableElement(
            tabbable.element.addNavItemIcon(new MODEL().set({
                label: t,
                icon: ICONS[t]
            })),
            tabbable.element.addMenu(new MODEL('horizontal').set('name', t))
        ));
        return tabbable;
    }
    /** Adds a single NAV Icon and associated SIDEBAR
        @param {string} name Name
        @param {string} label Label
        @param {string} icon Icon
        @param {string} align Alignment
        @returns {{tab, element}} Tabbable Element {tab,element}
    */
    addTabbableSidebar(name, label, icon = ICONS.CERTIFICATE, align = 'left') {
        return this.addTabbableElement(
            this.tabs.addNavItemIcon(new MODEL().set({
                icon,
                label
            })),
            this.menus.addChild(new SIDEBAR(this.menus, new MODEL().set({
                name,
                align
            })))
        );
    }
}
export { Activate, ANCHOR, Collapse, Collapsible, Deactivate, EL, Expand, LIST, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON, SIDEBAR }