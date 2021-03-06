/** @module */
import Clickable, { Activate, Deactivate } from '../../../../interface/Clickable.js';
import MENU, { Collapse, Expand } from '../menu/MENU.js';
import UL, { ATTRIBUTES, EL, LI, MODEL } from '../../list/ul/UL.js';
import ANCHOR from '../../a/anchor/ANCHOR.js';
/** A Navigation Item
    @class
    @extends LI
*/
export default class NAVITEM extends LI {
	/** Constructs a Nav Item (LI)
	    @param {UL} node The element that will contain this object
	    @param {MODEL} model The nav-item json object retrieved from the server
	*/
	constructor(node, model) {
		super(node, model); //new MODEL(model.attributes)
		this.addClass('nav-item');
		this.implement(new Clickable(this));
		this.anchor = new ANCHOR(this, model);
		this.addConstructor('MENU', () => this.addMenu(model));
		/** @type {EL} target Target switchable EL for NAV related events */
		this.target = model.target;
		if (model.label) {
			this.el.setAttribute('title', model.label);
		}
	}
	/** Add a MENU to this NAVITEM
	    @param {MODEL} model NavBarNav model
	    @returns {MENU} The newly created element
    */
	addMenu(model) {
		return this.addChild(new MENU(this, model));
    }
    /** Adds 'activate' and 'deactivate' Events that trigger the EL when this NAVITEM is activated
	    @param {EL} element A Switchable Element that is activated by this Tab
	    @returns {{tab:NAVITEM, element:EL}} Tabbable Element {tab,element}
	*/
	addTabbableElement(element) {
        this.target = element; // consider array to allow multiple targets
		element.tab = this;
		let deactivate = new Deactivate();
        this.el.addEventListener('activate', () => {
            element.dispatchToSiblings(deactivate, 'active');
            this.addClass('active');
            this.target.el.dispatchEvent(new Activate());
		});
		/** Deactivate Tab, Element and Children */
        this.target.el.addEventListener('deactivate', () => {
            this.filterEventDomException(this, deactivate);
            this.target.get().forEach((c) => this.chain(() => c.el.dispatchEvent(new Deactivate())));
        });
        this.el.addEventListener('deactivate', () => {
            this.filterEventDomException(this.target, deactivate);
            this.removeClass('active');
		});
		return {
			tab: this,
			element
		};
	}
}
export { ANCHOR, ATTRIBUTES, Collapse, EL, Expand, LI, MENU, MODEL, UL }