/** @module */
import MENU, { MODEL } from '../menu/MENU.js';
import { ICONS } from '../../../../enums/ICONS.js';
import SVG from '../../svg/SVG.js';
/** An expandable menu with clickable header that opens a container full of icons
    @class
    @extends MENU
*/
export default class NAVHEADER extends MENU {
	/** Construct a Nav Header.
	    @param {EL} node The object that the navHeader is appended to
	    @param {MODEL} model Object model
	 */
	constructor(node, model) {
		super(node, model);
		this.logo = new SVG(this, '0 0 32 32', '', '#CCC');
		this.tabs = new MENU(this, new MODEL('tabs'));
        this.tab = this.tabs.addNavItem(new MODEL('wide-tab').set({
            label: model.label
        }));
        this.addDefaultTab();
        this.optionsTab = this.tabs.addNavItemIcon(new MODEL('pull-right').set({
            icon: ICONS.COG
        }));
        this.menu = new MENU(this, new MODEL('collapse').set({
            name: 'menu'
        }));
        this.optionsTab.el.onclick = () => this.toggleCollapse();
		this.addOptionsMenu();
	}
	/** Adds the default toggle tab for this MENU
	    param {string} label The tab label
	    @returns {void}
	*/
	addDefaultTab() {		
        this.tab.el.onclick = () => { // Toggle Body
			this.getContainer().toggleBody();
		};
        this.tab.pressTimer = null; // Simulate LONG CLICK to edit the label
        this.tab.el.onmousedown = (ev) => {
			this.tab.pressTimer = window.setTimeout(() => {
				this.launchSidebarSave();
				ev.stopPropagation();
			}, 1000);
		};
        this.tab.el.onmouseup = (ev) => {
			clearTimeout(this.tab.pressTimer);
			ev.stopPropagation();
			return false;
		};
		//return tab;
	}
	/** Adds the Options/Config menu to the NavHeader.
        Adds a right aligned tab to show/hide the Options Menu
        @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
        @returns {void}
    */
	addOptionsMenu() {
		try {
			//if (this.getContainer().getMainContainer().user !== 'Guest') {
			if (document.getElementsByTagName('meta').user.content !== 'Guest') {
                ['ELEMENTS', 'CRUD', 'DOM'].forEach((opt) => this.menu.addMenu(new MODEL('horizontal collapse').set({
                    name: opt,
                    collapsed: 1, // Do not remove these!
                    showHeader: 1
                })));
			}
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
	/** Clears the Main sidebar is cleared and populated with
		a save form for this Container
	    @returns {void}
	*/
	launchSidebarSave() {
		try {
			console.log('Long Clicked ' + this.tab.anchor.label);
			let container = this.getContainer();
			let main = container.getMainContainer();
			main.sidebar.empty();
			main.toggleSidebar();
			container.save(main.sidebar);
			main.target = container;
		} catch (e) {
			console.warn(e);
		}
	}
	/**	Show/Hide this.menu
	    @returns {void}
	*/
	toggleCollapse() {
		$(this.menu.el).collapse('toggle');
	}
}