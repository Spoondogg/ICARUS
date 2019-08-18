/** @module */
import MENU, { Collapse, EL, Expand, MODEL } from '../../nav/menu/MENU.js';
import SWITCH, { Activate, BUTTON, Deactivate, ICONS, MODELS } from '../switch/SWITCH.js';
import STRING from '../../../../STRING.js';
/** Button that show/hides a list of options
    @class
    @extends BUTTON
*/
export default class TOGGLEBUTTON extends SWITCH {
	/** Construct a toggle button
	    @param {EL} node The parent object
        @param {ButtonAttributes} attributes Button Attributes
	*/
	constructor(node, attributes) {
		super(node, attributes);
        this.menu = new MENU(node, new MODEL().set('name', new STRING(attributes.label).friendly()));
        this.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.el)));
        this.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.el)));
	}
}
export { Activate, BUTTON, Collapse, Deactivate, EL, Expand, SWITCH, ICONS, MENU, MODELS }