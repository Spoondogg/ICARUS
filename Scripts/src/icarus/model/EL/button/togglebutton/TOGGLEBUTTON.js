/** @module */
import MENU, { Collapse, Expand, MODEL } from '../../nav/menu/MENU.js';
import SWITCH, { Activate, BUTTON, Deactivate, ICONS } from '../switch/SWITCH.js';
import STRING from '../../../../STRING.js';
/** Button that show/hides a list of options
    @class
    @extends BUTTON
*/
export default class TOGGLEBUTTON extends SWITCH {
	/** Construct a toggle button
	    @param {EL} node The parent object
	    @param {string} label The label
	    @param {string} glyphicon glyphicon
	    @param {string} buttonType buttonType
	*/
	constructor(node, label, glyphicon, buttonType) {
		super(node, label, glyphicon, buttonType);
        this.menu = new MENU(node, new MODEL().set('name', new STRING(label).friendly()));
        this.el.addEventListener('activate', () => this.menu.el.dispatchEvent(new Expand(this.el)));
        this.el.addEventListener('deactivate', () => this.menu.el.dispatchEvent(new Collapse(this.el)));
	}
}
export { Activate, BUTTON, Collapse, Deactivate, Expand, SWITCH, ICONS, MENU }