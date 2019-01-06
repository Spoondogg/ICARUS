/** @module */
import UL, { ATTRIBUTES, GROUP, LI, MODEL } from '../../ul/UL.js';
import Activate from '../../../../event/Activate.js';
import Collapsible from '../../../../interface/Collapsible/Collapsible.js';
import DIV from '../../div/DIV.js';
import Deselect from '../../../../event/Deselect.js';
import HEADER from '../../header/HEADER.js';
import NAVITEM from '../navitem/NAVITEM.js';
import NAVITEMICON from '../navitemicon/NAVITEMICON.js';
import NAVITEMTHUMBNAIL from '../navitem/navthumbnail/NAVTHUMBNAIL.js';
import NAVSEPARATOR from '../navitem/NAVSEPARATOR.js';
import Select from '../../../../event/Select.js';
import Selectable from '../../../../interface/Selectable/Selectable.js';
/** A collapseable list of Nav Items
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
        this.implement(new Selectable(this));
        this.implement(new Collapsible(this));
        // Override Selectable 
        this.select = () => this.callback(() => this.deselectAll().then(() => this.wrapper.select().then(() => this.expand())));
        this.deselect = () => this.callback(() => this.wrapper.deselect().then(() => this.collapse()));

        this.wrapper = new DIV(node, new MODEL('menu'));
        this.wrapper.addClass(model.wrapperClass);
        this.wrapper.implement(new Selectable(this));
        
        if (model.showHeader) {
            let label = model.label || model.name || '__Unknown';
            this.header = new HEADER(this.wrapper, new MODEL().set('label', label));
            this.header.implement(new Selectable(this));
            this.header.clickHandler(() => this.select(), () => this.deselect());
            this.header.el.addEventListener('wheel', () => this.scroll(), { passive: true });
		}
        $(this.el).appendTo(this.wrapper.el);

		this.addCase('MENU', () => this.addMenu(model));
		this.addCase('NAVITEM', () => this.addNavItem(model));
		this.addCase('NAVITEMICON', () => this.addNavItemIcon(model));
		this.addCase('NAVTHUMBNAIL', () => this.addNavThumbnail(model));
        this.addCase('NAVSEPARATOR', () => this.addNavSeparator());
    }
    /** Enables scroll Up/Down from the current MENU
        @param {Event} event Event
        @returns {void}
    */
    scroll(event) {
        this.wrapper.el.dispatchEvent(new Deselect(this));
        try {
            if (event.wheelDelta > 0) {
                console.log('scroll prev');
                if ($(this.wrapper.el).prev().children('header').length > 0) {
                    $(this.wrapper.el).prev().children('header')[0].dispatchEvent(new Select(this));
                }
            } else {
                console.log('scroll next');
                if ($(this.wrapper.el).next().children('header').length > 0) {
                    $(this.wrapper.el).next().children('header')[0].dispatchEvent(new Select(this));
                }
            }
        } catch (e) {
            if (e instanceof TypeError) {
                console.info('No element to scroll to');
            } else {
                throw e;
            }
        }
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
		/*for (let i = 0; i < navItems.length; i++) {
			this.addNavItem(navItems[i]);
		}*/
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
            this.el.dispatchEvent(new Activate(this));
			$('.dropdown-tab').removeClass('active');
			$(this).toggleClass('active');
			return true;
		} catch (e) {
			console.log('Unable to set this Item Group as active', e);
			return false;
		}
	}
}
export { ATTRIBUTES, GROUP, LI, MODEL, UL };