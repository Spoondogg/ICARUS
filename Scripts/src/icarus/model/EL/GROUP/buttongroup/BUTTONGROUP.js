/** @module */
import GROUP, { ATTRIBUTES, EL, MODEL } from '../GROUP.js';
import TOGGLEBUTTON, { BUTTON } from '../../button/togglebutton/TOGGLEBUTTON.js';
import { ALIGN } from '../../../../enums/ALIGN.js';
/** A container for Buttons
    @class
    @extends GROUP
*/
export default class BUTTONGROUP extends GROUP {
	/** Constructs a Group for containing Buttons
	    @param {EL} node Parent Node
        @param {MODEL} model Model
	*/
	constructor(node, model = new MODEL().set('label', 'buttons')) {
		super(node, 'DIV', model);
		this.addClass('btn-group');
		if (model.align === ALIGN.VERTICAL) {
			this.addClass('btn-group-vertical');
		}
		/* Add cases for each relevant constructor that inherited class does not have */
		this.addCallback('BUTTON', () => this.addButton('BUTTON'));
		this.addCallback('TOGGLEBUTTON', () => this.addToggleButton('TOGGLE'));
	}
	/** Creates a button and adds it to this button group, then adds it to the buttons array
	    @param {string} label The label
	    @param {string} glyphicon icon,
	    @param {string} buttonType button type
	    @returns {BUTTON} A generic button object
	*/
	addButton(label, glyphicon, buttonType) {
		let btn = new BUTTON(this, label, glyphicon, buttonType);
		btn.el.onclick = () => false;
		return this.addChild(btn);
	}
	/** Createa a toggle button with a corresponding dropdown menu
	    @param {string} label The label
	    @param {string} glyphicon The icon
	    @param {string} buttonType The button type
	    @returns {TOGGLEBUTTON} A toggle button
	*/
	addToggleButton(label, glyphicon, buttonType) {
		return this.addChild(new TOGGLEBUTTON(this, label, glyphicon, buttonType));
	}
}
export { ALIGN, ATTRIBUTES, BUTTON, EL, MODEL, TOGGLEBUTTON }