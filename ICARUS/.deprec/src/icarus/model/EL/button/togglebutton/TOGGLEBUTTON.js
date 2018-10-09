/**
    @module
*/
import '../../../../StringMethods.js';
import MENU, { MODEL } from '../../nav/menu/MENU.js';
import BUTTON from '../BUTTON.js';
/**
    Button that show/hides a list of options
    @class
    @extends BUTTON
*/
export default class TOGGLEBUTTON extends BUTTON {
	/**
	    Construct a toggle button
	    @param {EL} node The parent object
	    @param {string} label The label
	    @param {string} glyphicon glyphicon
	    @param {string} buttonType buttonType
	 */
	constructor(node, label, glyphicon, buttonType) {
		super(node, label, glyphicon, buttonType);
		this.addClass('dropdown-toggle');
		this.el.setAttribute('data-toggle', 'dropdown');
		this.el.setAttribute('aria-haspopup', 'true');
		this.el.setAttribute('aria-expanded', 'false');
		this.menu = new MENU(node, new MODEL().set('name', label.friendly()));
	}
}
export { BUTTON, MENU };