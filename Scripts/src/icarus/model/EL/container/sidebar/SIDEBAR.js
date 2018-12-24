/** @module */
import CONTAINER from '../CONTAINER.js';
/**
    A vertical navitemgroup with a search panel
    @class
    @extends CONTAINER
*/
export default class SIDEBAR extends CONTAINER { // NAVBAR
	/**
	    A Sidebar element
	    @param {MAIN} node The CONTAINERBODY to contain the sidebar
	    @param {MODEL} model The text that is displayed within the footer
	 */
	constructor(node, model) {
		super(node, 'ASIDE', model, ['SECTION', 'FORM', 'LIST', 'MENULIST']);
		this.addClass('sidebar');
	}
}