/** @module */
import UL, { ATTRIBUTES, EL, GROUP, LI, MODEL } from '../../ul/UL.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable/Switchable.js';
import DIV from '../../div/DIV.js';
import LIST from './list/LIST.js';
import NAVITEM from '../navitem/NAVITEM.js';
import NAVITEMICON from '../navitemicon/NAVITEMICON.js';
import NAVITEMTHUMBNAIL from '../navitem/navthumbnail/NAVTHUMBNAIL.js';
import NAVSEPARATOR from '../navitem/NAVSEPARATOR.js';
/** A collapseable list of Nav Items
    @extends DIV
*/
export default class MENU extends DIV {
	/** Construct a group of NavItems
	    @param {EL} node The element that will contain this object
	    @param {MODEL} model The json object representing this element        
	*/
    constructor(node, model) {
        super(node, model);
        this.setAttribute('name', model.name);
        this.addClass('menu');
        this.addCases(model);
        this.list = new LIST(this, new MODEL().set('name', model.name));
        this.implement(new Switchable(this));
        this.el.addEventListener('activate', () => this.list.expand());
        this.el.addEventListener('deactivate', () => this.list.collapse());
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
                this.list.children.filter((c) => c.className === 'MENU').forEach((c) => c.collapse());
            }
        };
    }
	/** Constructs a MENU inside this MENU
	    @param {MODEL} model Object model
	    @returns {MENU} Nav Item with Anchor
	*/
	addMenu(model) {
        this.list.children.push(new MENU(this.list, model));
        return this.list.addGroup(this.list.children[this.list.children.length - 1]);
	}
	/** Constructs a Nav Item (Anchor)
	    @param {MODEL} model Object model
	    @returns {NAVITEM} Nav Item with Anchor
	*/
	addNavItem(model) {
        this.list.children.push(new NAVITEM(this.list, model)); //model.url, model.label
        return this.list.addGroup(this.list.children[this.list.children.length - 1]);
	}
	/** Constructs a Nav Item Icon
	    @param {MODEL} model Object model
	    @returns {NAVITEMICON} Nav Item with Anchor
	*/
	addNavItemIcon(model) {
        this.list.children.push(new NAVITEMICON(this.list, model));
        return this.list.addGroup(this.list.children[this.list.children.length - 1]);
	}
	/** Constructs a Nav Item Thumbnail
	    @param {MODEL} model The model
	    @returns {NAVITEMTHUMBNAIL} A nav item with a thumbnail
	*/
	addNavThumbnail(model) {
        this.list.children.push(new NAVITEMTHUMBNAIL(this.list, model));
        return this.list.addGroup(this.list.children[this.list.children.length - 1]);
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
export { Activate, ATTRIBUTES, Deactivate, EL, GROUP, LI, MODEL, NAVITEM, NAVITEMICON, UL };