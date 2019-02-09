/** @module */
import MENU, { ANCHOR, Collapse, Collapsible, Expand, LIST, NAVITEM, NAVITEMICON } from '../menu/MENU.js';
import NAV, { EL, MODEL } from '../NAV.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable/Switchable.js';
import { ICONS } from '../../../../enums/ICONS.js';
//import SVG from '../../svg/SVG.js';
/** A full width collapseable NAV Element that generally contains tabs
    @class
    @extends NAV
*/
export default class NAVBAR extends NAV {
	/** Constructs a Navigation Panel
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
        @param {boolean} bottomUp If true, menus preceed tabs
	*/
	constructor(node, model, bottomUp = false) {
		super(node, model);
		this.addClass('navbar');
		this.implement(new Switchable(this));
		this.implement(new Collapsible(this));
		//this.icon = new SVG(this, '0 0 32 32', '', '#CCC').addClass('icon');
		this.tabs = new MENU(this, new MODEL('horizontal').set('name', 'tabs')); // @todo Should be its own class Horizontal Menu?
		this.tabs.activate();
		this.tabs.expand();
		this.menus = new MENU(this, new MODEL().set('name', 'menus'));
		if (bottomUp) {
			$(this.menus.el).insertBefore(this.tabs.el);
		}
		this.menus.activate();
		this.menus.expand();
	}
	/** Sets the 'activate' and 'deactivate' so that the NAVITEM will trigger the EL
	     @param {NAVITEM} navitem NAV Item that acts as a Tab
	     @param {EL} element A Switchable Element that is activated by this Tab
	     @returns {void}
	*/
	addTabbableElement(navitem, element) {
		navitem.el.addEventListener('activate', () => element.el.dispatchEvent(new Activate()));
		navitem.el.addEventListener('deactivate', () => element.el.dispatchEvent(new Deactivate()));
	}
}
export { Activate, ANCHOR, Collapse, Collapsible, Deactivate, EL, Expand, ICONS, LIST, MENU, MODEL, NAVITEM, NAVITEMICON }