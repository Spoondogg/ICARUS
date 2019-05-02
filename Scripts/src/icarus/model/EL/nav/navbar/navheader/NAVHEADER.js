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
		node.el.addEventListener('activate', () => this.tab.el.dispatchEvent(new Activate(this)));
		node.el.addEventListener('deactivate', () => this.tab.el.dispatchEvent(new Deactivate(this)));
		this.tab.el.addEventListener('activate', () => node.body.el.dispatchEvent(new Expand(this)));
        this.tab.el.addEventListener('deactivate', () => node.body.el.dispatchEvent(new Collapse(this)));
        this.tab.el.addEventListener('select', () => {
            let container = this.getContainer();
            container.getFactory().save(false, container, container, 'label');
        });
        this.addTabbableMenu('OPTIONS', 'OPTIONS', ICONS.COG, [
            this.createNavItemIconModel('ELEMENTS'),
            this.createNavItemIconModel('CRUD'),
            this.createNavItemIconModel('DOM')
        ]);
	}
	/** Adds a single NAV Icon and associated SIDEBAR
	    @param {string} name Name
	    @param {string} label Label
	    @param {string} icon Icon
	    @param {string} align Alignment
	    @returns {{tab:NAVITEMICON, element:SIDEBAR}} Tabbable Element {tab,element}
	*/
	addTabbableSidebar(name, label, icon = ICONS.CERTIFICATE, align = 'left') {
		return this.addTabbableElement(
			this.tabs.addNavItemIcon(new MODEL().set({
				icon,
				label,
				name
			})),
			this.menus.addChild(new SIDEBAR(this.menus, new MODEL().set({
				name,
				align
			})))
		);
	}
}
export { Activate, ANCHOR, Collapse, Collapsible, Deactivate, EL, Expand, LIST, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON, SIDEBAR }