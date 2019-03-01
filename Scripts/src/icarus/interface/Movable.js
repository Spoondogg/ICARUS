/** @module */
import IFACE, { EL } from './IFACE.js';
/** An interface for Move driven Events
    @class
    @extends IFACE
*/
export default class Movable extends IFACE {
	/** A series of Move Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'movable');
	}
	addListeners(node) {
        node.el.addEventListener('moveUp', () => node.moveUp());
        node.el.addEventListener('moveDown', () => node.moveDown());
		//node.el.addEventListener('left', () => node.left());
		//node.el.addEventListener('right', () => node.right());
	}
	setMethods(node) {
		/** Moves the element up
	        @returns {Promise<ThisType>} callback
	    */
		this.methods.moveUp = () => node.callback(() => console.log('Move Up', node));
		/** Moves the element down
		    @returns {Promise<ThisType>} callback
		*/
		this.methods.moveDown = () => node.callback(() => console.log('Move Down', node));
	}
}
export { EL, IFACE }