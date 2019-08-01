/** @module */
import EL, { MODEL } from '../EL.js';
import MENU, { ANCHOR, NAVITEM } from './menu/MENU.js';
/** Generic NAV Element 
    @class
    @extends MENU
*/
export default class NAV extends MENU {
	/** Constructs a NAV
	    @param {EL} node Node
	    @param {MenuModel} [model] Model
	*/
	constructor(node, model) {
		super(node, model, 'NAV');
	}
}
export { ANCHOR, EL, MODEL, NAVITEM }