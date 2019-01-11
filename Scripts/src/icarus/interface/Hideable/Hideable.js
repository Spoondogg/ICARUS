/** @module */
import IFACE, { EL } from '../IFACE.js';
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
    addListeners(node) {
        node.el.addEventListener('hide', () => node.hide());
        node.el.addEventListener('show', () => node.show());
    }
    setMethods(node) {
        /** Hides the element
	        @returns {Promise<ThisType>} callback
	    */
        this.methods.hide = () => node.callback(() => {
            node.el.style.display = 'none';
        });
        /** Shows the element
            @returns {Promise<ThisType>} callback
        */
        this.methods.show = () => node.callback(() => {
            node.el.style.display = 'block';
        });
    }
}
export { EL, IFACE }