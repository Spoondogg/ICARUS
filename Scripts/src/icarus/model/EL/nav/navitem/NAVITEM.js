/** @module */
import Clickable, { Activate, Deactivate } from '../../../../interface/Clickable.js';
import MENU, { Collapse, Expand } from '../menu/MENU.js';
import UL, { ATTRIBUTES, EL, LI, MODEL } from '../../list/ul/UL.js';
import ANCHOR from '../../a/anchor/ANCHOR.js';
import { LongclickDelay } from '../../../../enums/StyleVars.js';
import { MODELS } from '../../../../enums/DATAELEMENTS.js';
//import Tabbable from '../../../../interface/Tabbable.js';
/** A Navigation Item
    @class
*/
export default class NAVITEM extends LI {
	/** Constructs a Nav Item (LI)
	    @param {UL} node Node
	    @param {NavItemModel} [model] Model
        @param {ClickableOptions} [options] Options
	*/
    constructor(node, model = MODELS.navitem(), options) {
        super(node, model);
		this.addClass('nav-item');
		this.implement(new Clickable(this, options));
		this.anchor = new ANCHOR(this, model);
		this.addConstructor('MENU', () => this.addMenu(model));
		/** @type {EL} target Target switchable EL for NAV related events */
		this.target = model.target;
		if (model.label) {
			this.el.setAttribute('title', model.label);
		}
    }
    /** Creates a NavItemOptions constructor
        @returns {function(): NavItemOptions} NavItemOptions
    */
    createOptions() {
        return this.makeStruct([
            ['deactivateSiblings', false],
            ['delay', 200],
            ['longClickDelay', LongclickDelay],
            ['stopPropagation', true]
        ]);
    }
	/** Add a MENU to this NAVITEM
	    @param {MODEL} model NavBarNav model
	    @returns {MENU} The newly created element
    */
    addMenu(model) {
		return this.addChild(new MENU(this, model));
    }
    /** Adds 'activate' and 'deactivate' Events that trigger the EL when this NAVITEM is activated
	    @param {EL} element A Switchable Element that is activated by this Tab (ie: MENU)
        @param {NavItemOptions} [options] Options
	    @returns {{tab:NAVITEM, element:EL}} Tabbable Element {tab,element}
	*/
    addTabbableElement(element) { //, options = {deactivateSiblings: true}
        //this.implement(new Tabbable(this, element, options));

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