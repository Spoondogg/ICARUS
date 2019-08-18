/** @module */
import NAVITEM, { ANCHOR } from '../navitem/NAVITEM.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable.js';
import UL, { ATTR, ATTRIBUTES, Collapse, Collapsible, DATA, EL, Expand, LI, LIST, MODEL } from '../../list/ul/UL.js';
import { MODELS } from '../../../../enums/DATAELEMENTS.js';
import NAVBAR from '../navbar/NAVBAR.js';
import NAVITEMICON from '../navitemicon/NAVITEMICON.js';
import NAVITEMTHUMBNAIL from '../navitem/navthumbnail/NAVTHUMBNAIL.js';
import NAVSEARCH from '../navitem/NAVSEARCH.js';
import NAVSEPARATOR from '../navitem/NAVSEPARATOR.js';
/** A collapseable list of NAVITEMS */
export default class MENU extends LIST {
	/** Construct a MENU style list of NAVITEMS
	    @param {EL} node Node
	    @param {MenuModel} [model] Model
        @param {string} [element] HTML Element Tag
        @param {{canActivate, scrollIntoView, UId}} options Optional Parameters
	*/
    constructor(node, model, element = 'UL', options = MODELS.menuOptions()) {
		super(node, model, element);
		this.addClass('menu');
		//this.setAttribute('name', model.name);
		this.addCases(model);
		this.implement(new Switchable(this));
		if (options.canActivate) {
			this.el.addEventListener('activate', () => this.el.dispatchEvent(new Expand(this)));
			this.el.addEventListener('deactivate', () => this.el.dispatchEvent(new Collapse(this)));
		}
		if (options.scrollIntoView) {
			this.scrollOnExpand();
		}
	}
	/** Scroll the menu into view on Expansion
	    @returns {void}
	*/
	scrollOnExpand() {
		$(this.el).on('shown.bs.collapse', (ev) => {
			setTimeout(() => {
				this.el.scrollIntoView({
					alignTo: false,
					behavior: 'smooth' // smooth not supported in Safari
				});
			}, 200);
			ev.stopPropagation();
		});
	}
	/** Adds relevant cases to this element
	    @param {MenuModel} model Model
	    @returns {void}
	*/
	addCases(model) {
		this.addConstructor('MENU', () => this.addMenu(model));
		this.addConstructor('NAVITEM', () => this.addNavItem(model));
		this.addConstructor('NAVITEMICON', () => this.addNavItemIcon(model));
		this.addConstructor('NAVTHUMBNAIL', () => this.addNavThumbnail(model));
		this.addConstructor('NAVSEPARATOR', () => this.addNavSeparator());
	}
	/** Constructs a MENU inside this MENU
	    @param {MenuModel} model Model
	    @returns {MENU} Menu
	*/
	addMenu(model) {
		return this.addChild(new MENU(this, model));
	}
	/** Constructs a NavBar Element with TABS and MENUS
	    @param {MenuModel} model Model
	    @returns {NAVBAR} NavBar
	*/
	addNavBar(model) {
		return this.addChild(new NAVBAR(this, model));
	}
	/** Constructs a Nav Item (Anchor)
	    @param {NavItemModel} model Model
	    @returns {NAVITEM} Nav Item with Anchor
	*/
	addNavItem(model) {
		return this.addChild(new NAVITEM(this, model));
	}
	/** Constructs a Nav Item Icon
	    @param {NavItemModel} model Model
	    @returns {NAVITEMICON} Nav Item with Anchor
	*/
	addNavItemIcon(model) {
		return this.addChild(new NAVITEMICON(this, model));
    }
    /** Constructs a NavItem with a search input
	    @param {NavItemSearchModel} [model] Model
	    @returns {NAVSEARCH} Nav Item with Anchor
	*/
    addNavSearch(model) {
        return this.addChild(new NAVSEARCH(this, model));
    }
	/** Constructs a Nav Item Thumbnail
	    @param {NavItemModel} model Model
        @param {string} classType The class type that this thumbnail represents
	    @returns {NAVITEMTHUMBNAIL} A nav item with a thumbnail
	*/
	addNavThumbnail(model, classType = 'MODEL') {
		return this.addChild(new NAVITEMTHUMBNAIL(this, model, classType));
	}
	/** Adds an array of Nav Items
        @param {Array<NavItemModel>} navItems An array of NAVITEM(s)
        @returns {void}
    */
	addNavItems(navItems) {
		navItems.forEach((i) => this.addNavItem(i));
	}
	/** Adds a Separator (UI Only)    
        @param {string} [label] Label
        @returns {NAVSEPARATOR} A Navigation Menu Separator
	*/
	addNavSeparator(label = '') {
		return new NAVSEPARATOR(this, label);
    }
    /** When MENU loses focus, it will collapse any child MENU(s)
	    This ensures that only one menu is visible at any given time
	    @returns {void}
	*/
    collapseOnFocusOut() {
        this.el.onclick = (event) => {
            if (event.target !== this.el) {
                console.log('Collapsing child menus...', this);
                this.get().filter((c) => c.className === 'MENU').forEach((c) => c.collapse());
            }
        };
    }
    /** Deactivates all menu items except given
        @param {any} el Element to remain active
        @returns {void}
    */
    deactivateSiblings(el) {
        this.get().forEach((li) => {
            if (li !== el) {
                li.el.dispatchEvent(new Deactivate(li));
            }
        });
    }
    /** Returns the top level tab for this navbar
        @param {Name} name Tab Name
        @returns {NAVITEMICON} Reference Tab
    */
    getTab(name) {
        return this.get(name, 'NAVITEMICON')[0];
    }
    /** Returns the top level menu for this navbar
        @param {Name} name Menu Name
        @returns {MENU} Reference Menu
    */
    getMenu(name) {
        return this.get(name, 'MENU')[0];
    }
}
export { Activate, ANCHOR, ATTR, ATTRIBUTES, Collapse, Collapsible, DATA, Deactivate, EL, Expand, /*GROUP,*/ LI, LIST, MODEL, MODELS, NAVBAR, NAVITEM, NAVITEMICON, NAVSEARCH, UL }