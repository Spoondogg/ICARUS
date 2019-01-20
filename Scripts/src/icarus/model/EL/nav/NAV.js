/** @module */
import EL, {
	MODEL
} from '../EL.js';
import MENU from './menu/MENU.js';
/** Generic NAV Element 
    @class
    @extends MENU
*/
export default class NAV extends MENU {
	/** Constructs a NAV
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
	constructor(node, model) {
		super(node, model, 'NAV');
	}
}
export {
	EL,
	MODEL
}