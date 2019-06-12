/** @module */
import GROUP, { ATTRIBUTES, EL, MODEL } from '../GROUP.js';
import TOGGLEBUTTON, { BUTTON, ICONS } from '../../button/togglebutton/TOGGLEBUTTON.js';
import { ALIGN } from '../../../../enums/ALIGN.js';
/** A container for Buttons
    @class
    @extends GROUP
*/
export default class BUTTONGROUP extends GROUP {
	/** Constructs a Group for containing Buttons
	    @param {EL} node Parent Node
        @param {MODEL} [model] Model
	*/
	constructor(node, model = new MODEL().set('label', 'buttons')) {
		super(node, 'DIV', model);
		this.addClass('btn-group');
		if (model.align === ALIGN.VERTICAL) {
			this.addClass('btn-group-vertical');
		}
		/* Add cases for each relevant constructor that inherited class does not have */
		this.addConstructor('BUTTON', () => this.addButton('BUTTON'));
		this.addConstructor('TOGGLEBUTTON', () => this.addToggleButton('TOGGLE'));
	}
	/** Creates a button and adds it to this button group, then adds it to the buttons array
	    @param {string} label The label
	    @param {string} glyphicon icon
	    @param {string} [buttonType] The type of button ie: [button, reset, submit]
	    @returns {BUTTON} A generic button object
	*/
	addButton(label, glyphicon, buttonType) {
		let btn = new BUTTON(this, label, glyphicon, buttonType);
        btn.el.onclick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }
		return this.addChild(btn);
	}
	/** Createa a toggle button with a corresponding dropdown menu
	    @param {string} label The label
	    @param {string} glyphicon The icon
	    @param {string} [buttonType] The type of button ie: [button, reset, submit]
	    @returns {TOGGLEBUTTON} A toggle button
	*/
	addToggleButton(label, glyphicon, buttonType) {
		return this.addChild(new TOGGLEBUTTON(this, label, glyphicon, buttonType));
    }
    /** Get child BUTTON element by Name and optionally by Class
	    @param {string} [name] Element Name
        @param {string} [className] Element Class
	    @returns {Array<BUTTON>} Child Item/Element Filtered Results
        @description This might also be recognized as this.getChildren()
	*/
    get(name = null, className = null) {
        return super.get(name, className);
    }
}
export { ALIGN, ATTRIBUTES, BUTTON, EL, ICONS, MODEL, TOGGLEBUTTON }