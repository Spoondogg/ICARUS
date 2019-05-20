/** @module */
import IFACE, { EL } from './IFACE.js';
import Collapse from '../event/Collapse.js';
import Expand from '../event/Expand.js';
import Toggle from '../event/Toggle.js';
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
	/** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
	addListeners(node) {
		node.el.addEventListener('collapse', () => node.collapse());
		node.el.addEventListener('expand', () => node.expand());
		node.el.addEventListener('toggle', () => node.toggle());
	}
	/** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		/** Collapses the node
	        @returns {Promise<ThisType>} Promise Chain
	    */
		this.methods.collapse = () => node.chain(() => $(node.el).collapse('hide'));
		/** Expands the node
	        @returns {Promise<ThisType>} Promise Chain
	    */
        this.methods.expand = () => node.chain(() => $(node.el).collapse('show'));
        /** Toggles the node
            @returns {Promise<ThisType>} Promise Chain
        */
        this.methods.toggle = () => this.toggle('in', new Expand(node), new Collapse(node));
	}
}
export { Collapse, EL, Expand, IFACE, Toggle }