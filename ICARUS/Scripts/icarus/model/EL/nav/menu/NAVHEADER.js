/**
    @module
*/
import MENU from '../menu/MENU.js';
import MODEL from '../../../MODEL.js';
import ATTRIBUTES from '../../../ATTRIBUTES.js';
import { ICONS } from '../../../../enums/ICONS.js';
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
		// Left aligned group
		this.tabs = new MENU(this, new MODEL().set({
			'name': 'tabs'
		}));
		// Add a default tab to show/hide the collapse
		this.tab = this.tabs.addNavItem(new MODEL('pull-left').set({
			'anchor': new MODEL().set({
				'label': model.label,
				'url': '#'
			})
		}));
		this.tab.el.onclick = () => {
			console.log('Toggle Body');
			this.getContainer().toggleBody();
		};
		// Simulate LONG CLICK to edit the label
		this.tab.pressTimer;
		this.tab.el.onmousedown = (ev) => {
			this.tab.pressTimer = window.setTimeout(
				() => {
					this.launchSidebarSave();
					ev.stopPropagation();
				}, 1000);
		};
		this.tab.el.onmouseup = (ev) => {
			clearTimeout(this.tab.pressTimer);
			ev.stopPropagation();
			return false;
		};
		// If the user is a 'Guest', show the Login Button   
		try {
			if (this.getContainer().getMainContainer().user !== 'Guest') {
				// Add a default tab to show/hide the Options Menu
				this.toggle = this.tabs.addNavItem(new MODEL('pull-right').set({
					'anchor': new MODEL().set({
						'icon': ICONS.COG,
						'label': '',
						'url': '#'
					})
				})).el.onclick = this.toggleCollapse.bind(this);
				// Create the submenu to be toggled
				this.menu = new MENU(this, new MODEL('collapse').set({
					'name': 'menu'
				}));
				// Add Default OPTIONS groupings as HORIZONTAL menus
				let optionGroups = ['ELEMENTS', 'CRUD', 'DOM']; //'USER'
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
			if (modal !== null) {
				switch (modal.className) {
					case 'LOADER':
					case 'PROMPT':
						break;
					default:
						console.warn(this.className + ' exists inside an unrecognized Modal window.', modal);
						break;
				}
			} else {
				console.warn('Unable to retrieve MAIN Container', e);
				throw e;
			}
		}
	}
	/**
	    Clears the Main sidebar is cleared and populated with
	    a save form for this Container
	*/
	launchSidebarSave() {
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
	}
	/**
	    Show/Hide this.menu
	 */
	toggleCollapse() {
		$(this.menu.el).collapse('toggle');
	}
}