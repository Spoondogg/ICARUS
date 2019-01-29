/** @module */
import MENU, { ANCHOR, Collapse, Collapsible, Expand, LIST, NAVITEM, NAVITEMICON } from '../menu/MENU.js';
import NAV, { EL, MODEL } from '../NAV.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable/Switchable.js';
import { ICONS } from '../../../../enums/ICONS.js';
//import SVG from '../../svg/SVG.js';
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
		//this.icon = new SVG(this, '0 0 32 32', '', '#CCC').addClass('icon');
		this.tabs = new MENU(this, new MODEL('horizontal').set('name', 'tabs')); // @todo Should be its own class Horizontal Menu?
        this.tab = this.tabs.addNavItemIcon(new MODEL().set({
            icon: ICONS.CERTIFICATE,
            label: model.label
        }));
        node.el.addEventListener('activate', () => this.tab.el.dispatchEvent(new Activate()));
        node.el.addEventListener('deactivate', () => this.tab.el.dispatchEvent(new Deactivate()));
        this.tab.el.addEventListener('activate', () => node.body.el.dispatchEvent(new Expand()));
        this.tab.el.addEventListener('deactivate', () => node.body.el.dispatchEvent(new Collapse()));
        this.tabs.activate();
		this.tabs.expand();
		this.menus = new MENU(this, new MODEL().set('name', 'menus'));
		this.menus.activate();
		this.menus.expand();
		// Create initial OPTIONS Tab and Menu
        this.addOptionsMenu();
    }    
	/** Sets the 'activate' and 'deactivate' so that the NAVITEM will trigger the EL
	     @param {NAVITEM} navitem NAV Item that acts as a Tab
	     @param {EL} element A Switchable Element that is activated by this Tab
	     @returns {void}
	*/
	addTabbableElement(navitem, element) {
		navitem.el.addEventListener('activate', () => element.el.dispatchEvent(new Activate()));
		navitem.el.addEventListener('deactivate', () => element.el.dispatchEvent(new Deactivate()));
	}
	/** Adds the Options/Config menu
	    Adds a right aligned tab to show/hide the Options Menu
	    @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
	    @returns {void}
	*/
	addOptionsMenu() {
        try {
            // Create Primary Options tab and Menu
            this.btnOptions = this.tabs.addNavItemIcon(new MODEL().set({
                icon: ICONS.COG,
                label: 'OPTIONS'
            }));
            this.options = this.menus.addMenu(new MODEL().set('name', 'OPTIONS'));
            this.addTabbableElement(this.btnOptions, this.options);
            // Create Secondary Tabs and Horizontal Menus inside Options Menu
            ['ELEMENTS', 'CRUD', 'DOM'].map((name) => {
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
export { ANCHOR, Collapse, Collapsible, EL, Expand, LIST, MENU, MODEL, NAVITEM, NAVITEMICON }