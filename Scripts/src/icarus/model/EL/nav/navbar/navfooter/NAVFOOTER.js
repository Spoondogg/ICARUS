/** @module */
import NAVBAR, { ANCHOR, Collapse, Collapsible, EL, Expand, ICONS, LIST, MENU, MODEL, NAVITEM, NAVITEMICON } from '../NAVBAR.js';
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
}
export { ANCHOR, Collapse, Collapsible, EL, Expand, LIST, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON }