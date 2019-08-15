/** @module */
import NAVBAR, { ANCHOR, ATTRIBUTES, Activate, Collapse, Collapsible, Deactivate, EL, Expand, ICONS, LIST, MENU, MODEL, MODELS, NAVITEM, NAVITEMICON } from '../NAVBAR.js';
import SIDEBAR from '../../../container/sidebar/SIDEBAR.js';
/** A NAVBAR that acts as a CONTAINER Header
    @class
*/
export default class NAVHEADER extends NAVBAR {
	/** Constructs a NAVBAR that acts as a Top level Header for a Container
	    @param {EL} node Node
	    @param {MenuModel} [model] Model
	*/
    constructor(node, model) {
        super(node, model);
		this.addClass('nav-header');
		/** The CONTAINER Tab 
		    @todo Spoon.svg
		    @todo Consider moving into CONTAINER
		*/
        this.tab = this.tabs.addNavItemIcon(MODELS.navitem(model.label, ICONS.CERTIFICATE, 'tab', new ATTRIBUTES('tab-wide')));
        this.tab.el.addEventListener('activate', () => node.body.el.dispatchEvent(new Expand(this.tab)));
        this.tab.el.addEventListener('deactivate', () => node.body.el.dispatchEvent(new Collapse(this.tab)));
        //this.tab.el.addEventListener('activate', () => this.options.tabTarget.el.dispatchEvent(new Expand(this.tab)));
        //this.tab.el.addEventListener('deactivate', () => this.options.tabTarget.el.dispatchEvent(new Collapse(this.tab)));
        this.tab.el.addEventListener('select', () => {
            let container = this.getContainer();
            container.getFactory().save(false, container, container, 'label');
        });
        this.addTabbableMenu('OPTIONS', 'OPTIONS', ICONS.COG, [
            MODELS.navitem('ELEMENTS', ICONS.ELEMENTS, 'ELEMENTS'),
            MODELS.navitem('CRUD', ICONS.CRUD, 'CRUD'),
            MODELS.navitem('DOM', ICONS.DOM, 'DOM')
        ]);
	}
	/** Adds a single NAV Icon and associated SIDEBAR
	    @param {Name} name Name
	    @param {string} label Label
	    @param {string} icon Icon
	    @param {string} align Alignment
	    @returns {{tab:NAVITEMICON, element:SIDEBAR}} Tabbable Element {tab,element}
	*/
	addTabbableSidebar(name, label, icon = ICONS.CERTIFICATE, align = 'left') {
        return this.addTabbableElement(
            this.tabs.addNavItemIcon(MODELS.navitem(label, icon, name)),
			this.menus.addChild(new SIDEBAR(this.menus, new MODEL().set({
				name,
				align
			})))
		);
	}
}
export { Activate, ANCHOR, Collapse, Collapsible, Deactivate, EL, Expand, LIST, MENU, MODEL, NAVBAR, NAVITEM, NAVITEMICON, SIDEBAR }