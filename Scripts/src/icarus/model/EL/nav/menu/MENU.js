/** @module */
import NAVITEM, { ANCHOR } from '../navitem/NAVITEM.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable.js';
import UL, { ATTRIBUTES, Collapse, Collapsible, EL, Expand, LI, LIST, MODEL } from '../../list/ul/UL.js';
import NAVBAR from '../navbar/NAVBAR.js';
import NAVITEMICON from '../navitemicon/NAVITEMICON.js';
import NAVITEMTHUMBNAIL from '../navitem/navthumbnail/NAVTHUMBNAIL.js';
import NAVSEPARATOR from '../navitem/NAVSEPARATOR.js';
/** A collapseable list of NAVITEMS
    @extends LIST
*/
export default class MENU extends LIST {
	/** Construct a MENU style list of NAVITEMS
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
        @param {string} element HTML Element Tag
        @param {{canActivate: boolean, scrollIntoView: boolean}} options Optional Parameters
        @param {boolean} canActivate If false, the MENU will not expand on activation
        @param {boolean} scrollIntoView If true, the menu is scrolled into view when activated
	*/
	constructor(node, model, element = 'UL', options = {
		canActivate: true,
		scrollIntoView: false
	}) {
		super(node, model, element);
		this.addClass('menu');
		this.setAttribute('name', model.name);
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
    /** This should be a typedef
        @param {string} name Tab Name
        @param {string} [label] Tab Label
        @param {string} [icon] Tab Icon
        @returns {{name:string, label:string, icon:string}} NavItemIconModel
    */
    createNavItemIconModel(name, label = name, icon = name) {
        return {
            name,
            label,
            icon
        };
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
	    @param {MODEL} model MENU Model
	    @returns {void}
	*/
	addCases(model) {
		this.addConstructor('MENU', () => this.addMenu(model));
		this.addConstructor('NAVITEM', () => this.addNavItem(model));
		this.addConstructor('NAVITEMICON', () => this.addNavItemIcon(model));
		this.addConstructor('NAVTHUMBNAIL', () => this.addNavThumbnail(model));
		this.addConstructor('NAVSEPARATOR', () => this.addNavSeparator());
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
	/** Constructs a MENU inside this MENU
	    @param {MODEL} model Object model
	    @returns {MENU} Nav Item with Anchor
	*/
	addMenu(model) {
		return this.addChild(new MENU(this, model));
	}
	/** Constructs a NavBar Element with TABS and MENUS menus
	    @param {MODEL} model Object model
	    @returns {NAVBAR} NavBar
	*/
	addNavBar(model) {
		return this.addChild(new NAVBAR(this, model)); //model.url, model.label
	}
	/** Constructs a Nav Item (Anchor)
	    @param {MODEL} model Object model
	    @returns {NAVITEM} Nav Item with Anchor
	*/
	addNavItem(model) {
		return this.addChild(new NAVITEM(this, model)); //model.url, model.label
	}
	/** Constructs a Nav Item Icon
	    @param {MODEL|{label:string, icon:string, name:string}} model Object model
	    @returns {NAVITEMICON} Nav Item with Anchor
	*/
	addNavItemIcon(model) {
		return this.addChild(new NAVITEMICON(this, model));
	}
	/** Constructs a Nav Item Thumbnail
	    @param {MODEL} model The model
	    @returns {NAVITEMTHUMBNAIL} A nav item with a thumbnail
	*/
	addNavThumbnail(model) {
		return this.addChild(new NAVITEMTHUMBNAIL(this, model));
	}
	/** Adds an array of Nav Items
        @param {Array} navItems An array of NAVITEM
        @returns {void}
    */
	addNavItems(navItems) {
		navItems.forEach((i) => this.addNavItem(i));
	}
	/** Adds a Separator (UI Only)    
        @returns {NAVSEPARATOR} A Navigation Menu Separator
	*/
	addNavSeparator() {
		return new NAVSEPARATOR(this.list);
	}
}
export { Activate, ANCHOR, ATTRIBUTES, Collapse, Collapsible, Deactivate, EL, Expand, /*GROUP,*/ LI, LIST, MODEL, NAVBAR, NAVITEM, NAVITEMICON, UL }