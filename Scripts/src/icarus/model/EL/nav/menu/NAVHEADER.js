/** @module */
import MENU, {
	EL,
	MODEL,
	NAVITEM,
	NAVITEMICON
} from '../menu/MENU.js';
import {
	ICONS
} from '../../../../enums/ICONS.js';
import SVG from '../../svg/SVG.js';
/** An expandable menu with clickable header that opens a container full of icons
    @class
    @extends MENU
*/
export default class NAVHEADER extends MENU {
	/** Construct a Menu with a collection of Tabs
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		//console.log('navheader', node, model);
		super(node, model);
		//console.log('navheader super complete');
		this.addClass('navheader');
		this.logo = new SVG(this, '0 0 32 32', '', '#CCC');
		this.tabs = new MENU(this, new MODEL('tabs').set('name', 'tabs')); // @todo Should be its own class
		this.tab = this.tabs.addNavItem(new MODEL('wide-tab').set('label', model.label)); // Container should create this!!
		this.optionsTab = this.tabs.addNavItemIcon(new MODEL('pull-right').set('icon', ICONS.COG));
		this.tabs.expand();
		this.menu = new MENU(this, new MODEL().set('name', 'menu')); // Main Menu..?
		this.optionsTab.el.addEventListener('activate', () => this.menu.activate());
		this.optionsTab.el.addEventListener('deactivate', () => this.menu.deactivate());
		this.addOptionsMenu();
		this.expand();
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
export {
	EL,
	MODEL,
	NAVITEM,
	NAVITEMICON
}