/** @module */
import UL, { ATTRIBUTES, EL, GROUP, LI, MODEL } from '../../ul/UL.js';
import NAVITEM from '../navitem/NAVITEM.js';
import NAVITEMICON from '../navitemicon/NAVITEMICON.js';
import NAVITEMTHUMBNAIL from '../navitem/navthumbnail/NAVTHUMBNAIL.js';
import NAVSEPARATOR from '../navitem/NAVSEPARATOR.js';
/** A collapseable list of Nav Items
    @extends GROUP
*/
export default class MENU extends GROUP {
	/** Construct a group of NavItems
	    @param {EL} node The element that will contain this object
	    @param {MODEL} model The json object representing this element        
	*/
    constructor(node, model) {
        //console.log('menu', node, model);
        super(node, 'DIV', model);
        //console.log('menu super complete');
        this.addClass('menu');
        this.addCases(model);
        //console.log('list');
        this.list = new UL(this, new MODEL().set('name', model.name));
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
                this.children.filter((c) => c.className === 'MENU').forEach((c) => c.collapse());
            }
        };
    }
	/** Constructs a MENU inside this MENU
	    @param {MODEL} model Object model
	    @returns {MENU} Nav Item with Anchor
	*/
	addMenu(model) {
		this.children.push(new MENU(this, model));
		return this.addGroup(this.children[this.children.length - 1]);
	}
	/** Constructs a Nav Item (Anchor)
	    @param {MODEL} model Object model
	    @returns {NAVITEM} Nav Item with Anchor
	*/
	addNavItem(model) {
		this.children.push(new NAVITEM(this, model)); //model.url, model.label
		return this.addGroup(this.children[this.children.length - 1]);
	}
	/** Constructs a Nav Item Icon
	    @param {MODEL} model Object model
	    @returns {NAVITEMICON} Nav Item with Anchor
	*/
	addNavItemIcon(model) {
		this.children.push(new NAVITEMICON(this, model));
		return this.addGroup(this.children[this.children.length - 1]);
	}
	/** Constructs a Nav Item Thumbnail
	    @param {MODEL} model The model
	    @returns {NAVITEMTHUMBNAIL} A nav item with a thumbnail
	*/
	addNavThumbnail(model) {
		this.children.push(new NAVITEMTHUMBNAIL(this, model));
		return this.addGroup(this.children[this.children.length - 1]);
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
		return new NAVSEPARATOR(this);
	}
}
export { ATTRIBUTES, EL, GROUP, LI, MODEL, NAVITEM, NAVITEMICON, UL };