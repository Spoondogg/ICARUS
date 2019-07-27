/** @module */
import GROUP, { ATTRIBUTES, EL, MODEL } from '../GROUP.js';
import TOGGLEBUTTON, { Activate, BUTTON, Deactivate, ICONS, SWITCH } from '../../button/togglebutton/TOGGLEBUTTON.js';
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
        this.addConstructor('BUTTON', () => this.addButton(new MODEL({
            label: 'BUTTON',
            icon: ICONS.BLANK,
            buttonType: 'BUTTON'
        })));
        this.addConstructor('TOGGLEBUTTON', () => this.addToggleButton(new MODEL({
            label: 'TOGGLE',
            icon: ICONS.BLANK,
            buttonType: 'BUTTON'
        })));
        this.addConstructor('SWITCH', () => this.addSwitch(new MODEL({
            label: 'SWITCH',
            icon: ICONS.BLANK,
            buttonType: 'BUTTON'
        })));
	}
	/** Creates a button and adds it to this button group, then adds it to the buttons array
	    @param {ButtonModel} model Model
	    @returns {BUTTON} A generic button object
	*/
    addButton(model) {
        //console.log('BUTTONGROUP.' + this.node.toString() + '.addButton', this.node)
        let btn = new BUTTON(this, model);
        btn.el.onclick = (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }
		return this.addChild(btn);
	}
	/** Createa a switch button
        @param {ButtonModel} model Button Attributes
	    @returns {SWITCH} A toggle button
	*/
	addSwitch(model) {
        return this.addChild(new SWITCH(this, model));
    }
    /** Createa a toggle button with a corresponding dropdown menu
        @param {ButtonModel} model Button Attributes
	    @returns {TOGGLEBUTTON} A toggle button
	*/
    addToggleButton(model) {
        return this.addChild(new TOGGLEBUTTON(this, model));
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
export { Activate, ALIGN, ATTRIBUTES, BUTTON, Deactivate, EL, ICONS, MODEL, SWITCH, TOGGLEBUTTON }