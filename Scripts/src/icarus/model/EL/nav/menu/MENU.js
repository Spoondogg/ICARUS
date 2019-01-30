/** @module */
import NAVITEM, { ANCHOR } from '../navitem/NAVITEM.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable/Switchable.js';
import UL, { ATTRIBUTES, Collapse, Collapsible, EL, Expand, LI, LIST, MODEL } from '../../list/ul/UL.js';
import NAVITEMICON from '../navitemicon/NAVITEMICON.js';
import NAVITEMTHUMBNAIL from '../navitem/navthumbnail/NAVTHUMBNAIL.js';
import NAVSEPARATOR from '../navitem/NAVSEPARATOR.js';
//import GROUP from '../../group/GROUP.js';
/** A collapseable list of Nav Items
    @extends LIST
*/
export default class MENU extends LIST {
	/** Construct a MENU style list of NAVITEMS
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
        @param {string} element HTML Element Tag
	*/
	constructor(node, model, element = 'UL') {
		super(node, model, element);
		this.addClass('menu');
		this.setAttribute('name', model.name);
		this.addCases(model);
		this.implement(new Switchable(this));
        this.el.addEventListener('activate', () => this.expand());
        /*this.el.addEventListener('activate', () => {
            let pos = this.getMain().mousePos;

        });*/
		this.el.addEventListener('deactivate', () => this.collapse());
	}
	/** Adds relevant cases to this element
	    @param {MODEL} model MENU Model
	    @returns {void}
	*/
	addCases(model) {
		this.addCallback('MENU', () => this.addMenu(model));
		this.addCallback('NAVITEM', () => this.addNavItem(model));
		this.addCallback('NAVITEMICON', () => this.addNavItemIcon(model));
		this.addCallback('NAVTHUMBNAIL', () => this.addNavThumbnail(model));
		this.addCallback('NAVSEPARATOR', () => this.addNavSeparator());
	}
	/** When MENU loses focus, it will collapse any child MENU(s)
	    This ensures that only one menu is visible at any given time
	    @returns {void}
	*/
	collapseOnFocusOut() {
		this.el.onclick = (event) => {
			if (event.target !== this.el) {
				this.children.filter((c) => c.className === 'MENU').forEach((c) => c.collapse());
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
	/** Constructs a Nav Item (Anchor)
	    @param {MODEL} model Object model
	    @returns {NAVITEM} Nav Item with Anchor
	*/
	addNavItem(model) {
		return this.addChild(new NAVITEM(this, model)); //model.url, model.label
	}
	/** Constructs a Nav Item Icon
	    @param {MODEL} model Object model
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
export { Activate, ANCHOR, ATTRIBUTES, Collapse, Collapsible, Deactivate, EL, Expand, /*GROUP,*/ LI, LIST, MODEL, NAVITEM, NAVITEMICON, UL }