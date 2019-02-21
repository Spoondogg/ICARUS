/** @module */
import NAVBAR, { ANCHOR, Activate, Collapse, Collapsible, Deactivate, EL, Expand, ICONS, LIST, MENU, MODEL, NAVITEM, NAVITEMICON } from '../NAVBAR.js';
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
		this.addOptionsMenu();
	}
	/** Adds the Options/Config menu
	    Adds a right aligned tab to show/hide the Options Menu
	    @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
        @param {string} name MENU Name
        @param {string} label TAB Label
        @param {string} icon TAB Icon
        @param {Array<string>} secondaryTabs Array of Tab names
	    @returns {void}
	*/
    addOptionsMenu(name = 'OPTIONS', label = 'OPTIONS', icon = ICONS.COG, secondaryTabs = ['ELEMENTS', 'CRUD', 'DOM']) {
        try {
            // Create Primary tab and Menu
            let tabbable = this.addTabbableElement(
                this.tabs.addNavItemIcon(new MODEL().set({
                    icon,
                    label
                })),
                this.menus.addMenu(new MODEL().set('name', name))
            );
			// Create Secondary Tabs and Horizontal Menus inside Options Menu            
            secondaryTabs.forEach((t) => this.addTabbableElement(
                tabbable.element.addNavItemIcon(new MODEL().set({
                    label: t,
                    icon: ICONS[t]
                })),
                tabbable.element.addMenu(new MODEL('horizontal').set('name', t))
            ));
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
export { Activate, ANCHOR, Collapse, Collapsible, Deactivate, EL, Expand, LIST, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON }