/** @module */
import BUTTONGROUP, { ALIGN, ATTRIBUTES, Activate, BUTTON, Deactivate, EL, ICONS, MODEL, SWITCH } from '../BUTTONGROUP.js';
/** A container for TAGS
    @class
*/
export default class TAGGROUP extends BUTTONGROUP {
	/** Constructs a Group for containing TAGS (Switchable Buttons)
	    @param {EL} node Parent Node
        @param {MODEL} [model] Model
	*/
	constructor(node, model = new MODEL().set('label', 'buttons')) {
		super(node, 'DIV', model);
		this.addClass('tag-group');		
	}    
}
export { Activate, ALIGN, ATTRIBUTES, BUTTON, Deactivate, EL, ICONS, MODEL, SWITCH }