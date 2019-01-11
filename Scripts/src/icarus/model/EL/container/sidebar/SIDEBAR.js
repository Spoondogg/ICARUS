/** @module */
import CONTAINER, { MODEL } from '../CONTAINER.js';
/** A Sidebar Container
    @class
    @extends CONTAINER
*/
export default class SIDEBAR extends CONTAINER {
	/** A Sidebar Container Element
	    @param {CONTAINER} node Parent Container (Typically MAIN)
	    @param {MODEL} model Model
	*/
    constructor(node, model = new MODEL().set('name', 'sidebar')) {
		super(node, 'ASIDE', model, ['SECTION', 'FORM', 'LIST', 'MENULIST']);
        this.addClass('sidebar');
        this.deactivate();
	}
}
export { MODEL }