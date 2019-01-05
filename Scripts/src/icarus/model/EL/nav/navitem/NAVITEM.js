/** @module */
import UL, { ANCHOR, ATTRIBUTES, EL, LI, MODEL } from '../../ul/UL.js';
import Activate from '../../../../event/Activate.js';
import Deactivate from '../../../../event/Deactivate.js';
import Deselect from '../../../../event/Deselect.js';
import MENU from '../menu/MENU.js';
import Select from '../../../../event/Select.js';
import Switchable from '../../../../interface/Switchable/Switchable.js';
/** A wide navigation button
    @description Nav items can be single buttons or dropdowns with nav items nested within them  
    @class
    @extends LI
*/
export default class NAVITEM extends LI {
	/** Constructs a Nav Item 
	    @param {UL} node The element that will contain this object
	    @param {MODEL} model The nav-item json object retrieved from the server
	*/
	constructor(node, model) {
		super(node, new MODEL(model.attributes));
		this.addClass('nav-item');
		this.anchor = new ANCHOR(this, model);
		this.addCase('MENU', () => this.addMenu(model));
		if (model.label) {
			this.el.setAttribute('title', model.label);
        }

        this.implement(new Switchable(this));
        //this.implement(new Selectable(this));

        // Element can be activated / deactivated with a click
        this.el.addEventListener('activate', () => this.addClass('active'));
        this.el.addEventListener('deactivate', () => this.removeClass('active'));
        this.el.addEventListener('select', () => this.addClass('select'));
        this.el.addEventListener('deselect', () => this.removeClass('select'));
        this.clickHandler(
            () => this.toggle('active', new Activate(this), new Deactivate(this)),
            () => this.toggle('select', new Select(this), new Deselect(this))
        );
    }
    /** Toggles the active state of this element 
        @param {string} className ClassName to look for
        @param {Event} eventOn Event to call if class does not yet exist
        @param {Event} eventOff Event to call if class already exists
        @returns {ThisType} callback
    */
    toggle(className = 'active', eventOn, eventOff) {
        this.callback(() => {
            let event = this.hasClass(className) ? eventOff : eventOn;
            console.log('NAVITEM.toggle()', event);
            this.el.dispatchEvent(event);
        });
    }
	/** Add a {@link MENU} to this element
	    @param {MODEL} model NavBarNav model
	    @returns {MENU} The newly created element
    */
	addMenu(model) {
		this.children.push(new MENU(this, model));
		return this.children[this.children.length - 1];
	}
}
export { ANCHOR, ATTRIBUTES, EL, LI, MENU, MODEL, UL };