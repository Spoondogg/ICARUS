/** @module */
import MENU, { ANCHOR, Collapse, Collapsible, Expand, LIST, NAVITEM, NAVITEMICON } from '../menu/MENU.js';
import NAV, { EL, MODEL } from '../NAV.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable.js';
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
	     @param {NAVITEM} tab NAV Item that acts as a Tab
	     @param {EL} element A Switchable Element that is activated by this Tab
	     @returns {Object} Newly configured tab and element
	*/
    addTabbableElement(tab, element) {
        tab.target = element;
        element.tab = tab;
        let deactivate = new Deactivate();
        tab.el.addEventListener('activate', () => {
            element.dispatchToSiblings(deactivate);
            tab.target.el.dispatchEvent(new Activate()); // Activate Element
        });
        /** Deactivate Tab and Element */
        tab.target.el.addEventListener('deactivate', () => this.filterEventDomException(tab, deactivate));
        tab.el.addEventListener('deactivate', () => this.filterEventDomException(tab.target, deactivate));
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