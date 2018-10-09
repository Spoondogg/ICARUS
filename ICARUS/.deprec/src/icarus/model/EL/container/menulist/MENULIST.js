/**
    @module
*/
import CONTAINER, { MODEL } from '../CONTAINER.js';
import MENU, { LI, UL } from '../../nav/menu/MENU.js';
/**
    MenuList Constructor
    @description A MENULIST is essentially a UL that is designed to contain List Items (LI)

    @class
    @extends CONTAINER
*/
export default class MENULIST extends CONTAINER {
	/**
	    Constructs An Unordered List
	    @param {EL} node Parent Node
	    @param {MODEL} model Object MODEL
	 */
	constructor(node, model) {
		super(node, 'DIV', model, []); //'LISTITEM'
		this.addClass('menulist');
		//this.populate(model.children);
	}
	construct() {
		this.menu = new MENU(this.body.pane, new MODEL('menulist-menu').set({
			'label': this.label
		}));
	}
}
export { LI, MENU, UL };