/** @module */
import MENU, { ANCHOR, Collapse, Collapsible, Expand, LIST, NAVITEM, NAVITEMICON } from '../menu/MENU.js';
import NAV, { EL, MODEL } from '../NAV.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable.js';
import { ICONS } from '../../../../enums/ICONS.js';
/** A full width collapseable NAV Element that generally contains tabs
    @class
    @extends NAV
*/
export default class NAVBAR extends NAV {
	/** Constructs a Navigation Panel
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
        @param {boolean} bottomUp If true, menus preceed tabs
        @param {boolean} horizontalTabs If true (default), tabs are aligned horizontally
	*/
	constructor(node, model, bottomUp = false, horizontalTabs = true) {
		super(node, model);
		this.addClass('navbar');
		this.implement(new Switchable(this));
		this.implement(new Collapsible(this));
		//this.icon = new SVG(this, '0 0 32 32', '', '#CCC').addClass('icon');
		this.tabs = new MENU(this, new MODEL(horizontalTabs ? 'horizontal' : '').set('name', 'tabs')); // @todo Should be its own class Horizontal Menu?
		this.tabs.el.dispatchEvent(new Activate(this.tabs));
		this.tabs.el.dispatchEvent(new Expand(this.tabs));
		this.menus = new MENU(this, new MODEL().set('name', 'menus'));
		if (bottomUp) {
			$(this.menus.el).insertBefore(this.tabs.el);
		}
		this.menus.el.dispatchEvent(new Activate(this.menus));
		this.menus.el.dispatchEvent(new Expand(this.menus));
	}
    /** Creates a NAVITEMICON with an associated MENU, then adds given secondary tabbable sub-menus
        @param {string} name MENU Name
        @param {string} label TAB Label
        @param {string} icon TAB Icon
        @param {Array<{label:string, icon:string, name:string}>} secondaryTabs Array of Tab names ie label:string, icon:string, name:string
        @param {boolean} isHorizontal If true (default), secondary tab menu is horizontal
        @returns {{tab:NAVITEMICON, element:MENU}} Tabbable Element with submenus
    */
	addTabbableMenu(name, label = name, icon = ICONS.CERTIFICATE, secondaryTabs = [], isHorizontal = true) {
        let tabbable = this.addTabbableElement( // Create Primary tab and Menu
            this.tabs.addNavItemIcon(new MODEL().set({
                icon,
                label,
                name
            })),
            this.menus.addMenu(new MODEL().set('name', name))
        );	    
        secondaryTabs.forEach((t) => this.addTabbableElement( // Create Secondary Tabs and Horizontal Menus inside Menu
            tabbable.element.addNavItemIcon(new MODEL().set(t)),
            tabbable.element.addMenu(new MODEL(isHorizontal ? 'horizontal' : '').set('name', t.name))
        ));
        return tabbable;
	}	
	/** Adds the Options/Config menu
	    Adds a 'right-aligned' or 'full-width' tab to show/hide the Options Menu
        @param {string} label NAVITEMICON.label
        @param {string} icon NAVITEMICON icon
        @param {string} name MENU name
        @param {Array<string>} children Sample child tabs
        @param {boolean} isHorizontal If true (default), sub-menu is horizontal with icons, else vertical
	    @throws Throws an error if this NAVHEADER is not a child of a valid CONTAINER or MODAL
	    @returns {{tab:NAVITEMICON, menu:MENU}} Tab and Menu
	*/
	addOptionsMenu(label = 'OPTIONS', icon = ICONS.COG, name = label, children = ['SUB1', 'SUB2'], isHorizontal = true) {
		try {
			// Create Primary Options tab and Menu
			let tab = this.tabs.addNavItemIcon(new MODEL('tab-wide').set({
				icon,
				label,
				name
			}));
			let menu = this.menus.addMenu(new MODEL().set('name', name));
			this.addTabbableElement(tab, menu);
			// Create Secondary Tabs and Horizontal Menus inside Options Menu
			let optMenuClass = isHorizontal ? 'horizontal' : '';
			children.map((str) => {
				let tb = menu.addNavItemIcon(new MODEL().set({
					label: str,
					icon: ICONS[str],
					name: str
				}));
				let opt = menu.addMenu(new MODEL(optMenuClass).set('name', str));
				this.addTabbableElement(tb, opt);
            });

            return {
                tab,
                menu
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
	/** Sets the 'activate' and 'deactivate' so that the NAVITEM will trigger the EL
	     @param {NAVITEM} tab NAV Item that acts as a Tab
	     @param {EL} element A Switchable Element that is activated by this Tab
	     @returns {{tab:NAVITEM, element:EL}} Tabbable Element {tab,element}
         @todo Create TABBABLE Class
	*/
	addTabbableElement(tab, element) {
		tab.target = element;
		element.tab = tab;
		let deactivate = new Deactivate();
		tab.el.addEventListener('activate', () => {
            element.dispatchToSiblings(deactivate);
            //tab.addClass('active');
            tab.target.el.dispatchEvent(new Activate()); // Activate Element
            /*if (this.getContainer().className !== 'MAIN') {
                console.log('scrollTo', this);
                tab.scrollTo();
            }*/
		});
		/** Deactivate Tab and Element */
		tab.target.el.addEventListener('deactivate', () => this.filterEventDomException(tab, deactivate));
		tab.el.addEventListener('deactivate', () => {
            this.filterEventDomException(tab.target, deactivate);
            tab.removeClass('active');
			tab.target.el.dispatchEvent(new Deactivate()); // Deactivate Element
		});
		// Deactivate children
		tab.target.el.addEventListener('deactivate', () => tab.target.get().forEach((c) => c.el.dispatchEvent(new Deactivate())));
		return {
			tab,
			element
		};
	}
	/** Catches DOM Exception when event is already being dispatched
	    @param {EL} element Element Class to dispatch event
	    @param {Event} event Deactivate Event
	    @returns {void}
	*/
	filterEventDomException(element, event) {
		try {
			element.el.dispatchEvent(event);
		} catch (e) {
			if (!(e instanceof DOMException)) { // DOMException: Event is already being dispatched
				console.warn(e.message);
				throw e;
			}
		}
	}
}
export { Activate, ANCHOR, Collapse, Collapsible, Deactivate, EL, Expand, ICONS, LIST, MENU, MODEL, NAVITEM, NAVITEMICON }