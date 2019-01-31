/** @module */
import NAVBAR, { ANCHOR, Activate, Collapse, Collapsible, Deactivate, EL, Expand, ICONS, LIST, MENU, MODEL, NAVITEM, NAVITEMICON } from '../NAVBAR.js';
/** A NAVBAR that acts as a CONTAINER Header
    @class
    @extends NAVBAR
*/
export default class NAVFOOTER extends NAVBAR {
	/** Constructs a NAVBAR that acts as a CONTAINER Header
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, model, true);
        this.addClass('nav-footer');
        //$(this.menus.el).insertBefore(this.tabs.el);
		
        /*this.tab = this.tabs.addNavItemIcon(new MODEL('tab-console').set({
            icon: ICONS.CONSOLE,
            label: 'CONSOLE'
        }));*/
        //node.el.addEventListener('activate', () => this.tab.el.dispatchEvent(new Activate()));
        //node.el.addEventListener('deactivate', () => this.tab.el.dispatchEvent(new Deactivate()));
        //this.tab.el.addEventListener('activate', () => node.body.el.dispatchEvent(new Expand()));
        //this.tab.el.addEventListener('deactivate', () => node.body.el.dispatchEvent(new Collapse()));
        
		// Create initial OPTIONS Tab and Menu
        this.addOptionsMenu();
    }
	/** Adds the Options/Config menu
	    Adds a right aligned tab to show/hide the Options Menu
	    @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
	    @returns {void}
	*/
	addOptionsMenu() {
        try {
            // Create Primary Options tab and Menu
            this.btnOptions = this.tabs.addNavItemIcon(new MODEL('tab-wide').set({
                icon: ICONS.COG,
                label: 'OPTIONS'
            }));
            this.options = this.menus.addMenu(new MODEL().set('name', 'OPTIONS'));
            this.addTabbableElement(this.btnOptions, this.options);
            // Create Secondary Tabs and Horizontal Menus inside Options Menu
            ['SUB1', 'SUB2'].map((name) => {
                let tb = this.options.addNavItemIcon(new MODEL().set({
                    label: name,
                    icon: ICONS[name]
                }));
                let opt = this.options.addMenu(new MODEL('horizontal').set('name', name));
                this.addTabbableElement(tb, opt);
            });
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
export { ANCHOR, Collapse, Collapsible, EL, Expand, LIST, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON }