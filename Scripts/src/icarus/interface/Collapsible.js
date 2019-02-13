/** @module */
import Collapse from '../event/Collapse.js';
import Expand from '../event/Expand.js';
import IFACE from './IFACE.js';
/** An interface for Collapse driven Events
    @class
    @extends IFACE
*/
export default class Collapsible extends IFACE {
	/** A series of Collapse Related Events and Methods
        By default, a collapsible element is collapsed
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'collapse');
	}
	addListeners(node) {
		node.el.addEventListener('collapse', () => node.collapse());
		node.el.addEventListener('expand', () => node.expand());
		node.el.addEventListener('toggle', () => this.toggle('in', new Expand(node), new Collapse(node)));
	}
	setMethods(node) {
		/** Collapses the node
	        @returns {Promise<ThisType>} callback
	    */
		//this.methods.collapse = () => node.removeClass('in');
		this.methods.collapse = () => node.callback(() => $(node.el).collapse('hide'));
		/** Expands the node
	        @returns {Promise<ThisType>} callback
	    */
		//this.methods.expand = () => node.addClass('in');
		this.methods.expand = () => node.callback(() => $(node.el).collapse('show'));
	}
}
export { Collapse, Expand, IFACE }