/** @module */
import UL, { ATTRIBUTES, LI, MODEL } from '../../ul/UL.js';
import DIV from '../../div/DIV.js';
import HEADER from '../../header/HEADER.js';
import NAVITEM from '../navitem/NAVITEM.js';
import NAVITEMICON from '../navitemicon/NAVITEMICON.js';
import NAVSEPARATOR from '../navitem/NAVSEPARATOR.js';
/** A collapseable list of Nav Items
    @class
    @extends UL
*/
export default class MENU extends UL {
	/** Construct a group of NavItems
	    @param {EL} node The element that will contain this object
	    @param {MODEL} model The json object representing this element        
	 */
	constructor(node, model) {
        super(node, model);
        this.addClass('list');
		this.wrapper = new DIV(node, new MODEL('menu'));
		if (model.showHeader) {
			this.header = new HEADER(this.wrapper, new MODEL().set({
				'label': model.label || model.name || '__Unknown'
			}));
		}
		$(this.el).appendTo(this.wrapper.el);
		if (model.showHeader) {
			this.header.el.onclick = () => {
				$(this.el).collapse('toggle');
			};
		}
		this.addCase('MENU', () => this.addMenu(model));
        this.addCase('NAVITEM', () => this.addNavItem(model));
        this.addCase('NAVITEMICON', () => this.addNavItemIcon(model));
		this.addCase('NAVSEPARATOR', () => this.addNavSeparator());
	}
	/** Toggles the collapsed state of the 'COLLAPSE'
        @returns {void}
    */
	toggleCollapse() {
		$(this.el).collapse('toggle');
	}
	/** Collapses the container's body
	    @returns {boolean} true if hidden
	*/
	hide() {
		try {
			$(this.collapse.el).collapse('hide');
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	/** Expands the container's body
        @returns {void}
    */
	show() {
		try {
			$(this.collapse.el).collapse('show');
		} catch (e) {
			console.log(e);
		}
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
		this.children.push(new NAVITEMICON(this, model)); //model.url, model.label
		return this.addGroup(this.children[this.children.length - 1]);
	}
	/** Adds an array of Nav Items
        @param {Array} navItems An array of NAVITEM
        @returns {void}
    */
	addNavItems(navItems) {
		for (let i = 0; i < navItems.length; i++) {
			this.addNavItem(navItems[i]);
		}
	}
	/** Adds a Separator (UI Only)    
        @returns {NAVSEPARATOR} A Navigation Menu Separator
	*/
	addNavSeparator() {
		return new NAVSEPARATOR(this);
	}
	/** Sets this tab as active
	    @returns {boolean} true if successful
    */
	setActive() {
		try {
			$('.dropdown-tab').removeClass('active');
			$(this).toggleClass('active');
			return true;
		} catch (e) {
			console.log('Unable to set this Item Group as active', e);
			return false;
		}
	}
}
export { ATTRIBUTES, LI, MODEL, UL };