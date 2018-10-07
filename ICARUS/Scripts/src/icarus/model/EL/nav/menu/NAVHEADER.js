/**
    @module
*/
import MENU, { ATTRIBUTES, MODEL } from '../menu/MENU.js';
import { ICONS } from '../../../../enums/ICONS.js';
import SVG from '../../svg/SVG.js';
/**
    An expandable menu with clickable header that opens a container full of icons
    @class
    @extends MENU
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
		this.logo = new SVG(this, '0 0 32 32', '', '#CCC');
		this.tabs = new MENU(this, new MODEL().set({ // Left aligned group
			'name': 'tabs'
		}));
		this.tab = this.addDefaultTab(model.label);
		this.addOptionsMenu();
	}
	/**
	    Adds the default toggle tab button to this Nav Header
	    @param {string} label The tab label
	    @returns {NAVITEM} A Default Tab
	*/
	addDefaultTab(label) {
		let tab = this.tabs.addNavItem(new MODEL('pull-left').set({ // Add a default tab to show/hide the collapse
			'anchor': new MODEL().set({
				label,
				'url': '#'
			})
		}));
		tab.el.onclick = () => { // Toggle Body
			this.getContainer().toggleBody();
		};
		tab.pressTimer = null; // Simulate LONG CLICK to edit the label
		tab.el.onmousedown = (ev) => {
			this.tab.pressTimer = window.setTimeout(() => {
				this.launchSidebarSave();
				ev.stopPropagation();
			}, 1000);
		};
		tab.el.onmouseup = (ev) => {
			clearTimeout(this.tab.pressTimer);
			ev.stopPropagation();
			return false;
		};
		return tab;
	}
	/**
		    Adds the Options/Config menu to the NavHeader.
	        Adds a right aligned tab to show/hide the Options Menu
	        @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
		    @returns {void}
		*/
	addOptionsMenu() {
		try {
			if (this.getContainer().getMainContainer().user !== 'Guest') {
				this.toggle = this.tabs.addNavItem(new MODEL('pull-right').set({
					'anchor': new MODEL().set({
						'icon': ICONS.COG,
						'label': '',
						'url': '#'
					})
				}));
				this.toggle.el.onclick = this.toggleCollapse.bind(this);
				this.menu = new MENU(this, new MODEL('collapse').set({ // Create the submenu to be toggled
					'name': 'menu'
				}));
				let optionGroups = ['ELEMENTS', 'CRUD', 'DOM']; //'USER' // Add Default OPTIONS groupings as HORIZONTAL menus
				for (let oG = 0; oG < optionGroups.length; oG++) {
					this.menu.addMenu(new MODEL(new ATTRIBUTES('horizontal collapse')).set({
						'name': optionGroups[oG],
						'showHeader': 1,
						'collapsed': 1
					}));
				}
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
	/**
		    Clears the Main sidebar is cleared and populated with
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
	/**
		    Show/Hide this.menu
	        @returns {void}
		 */
	toggleCollapse() {
		$(this.menu.el).collapse('toggle');
	}
}