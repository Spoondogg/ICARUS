/** @module */
import IFACE, {	EL } from './IFACE.js';
/** An interface for Display driven Events
    @class
    @extends IFACE
*/
export default class Hideable extends IFACE {
	/** A series of Display Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'hideable');
    }
    /** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
	addListeners(node) {
		node.el.addEventListener('hide', () => node.hide());
		node.el.addEventListener('show', () => node.show());
    }
    /** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		/** Hides the element
	        @returns {Promise<ThisType>} Promise Chain
	    */
        this.methods.hide = () => node.chain(() => {
			node.el.style.display = 'none';
		});
		/** Shows the element
		    @returns {Promise<ThisType>} Promise Chain
		*/
        this.methods.show = () => node.chain(() => {
			node.el.style.display = 'block';
		});
	}
}
export { EL, IFACE }