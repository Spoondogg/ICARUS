/** @module */
import IFACE from '../IFACE.js';
/** An interface for Scroll and Wheel driven Events
    @class
    @extends INTERFACE
*/
export default class Scrollable extends IFACE {
	/** A series of Scroll and Wheel Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        param {Event} eventOn Event to call if class does not yet exist
        param {Event} eventOff Event to call if class already exists
	*/
    constructor(node) {
        super(node);
        node.addClass('scrollable');
        node.el.addEventListener('scrollUp', () => node.scrollUp());
        node.el.addEventListener('scrollDown', () => node.scrollDown());
        node.el.addEventListener('scrollLeft', () => node.scrollLeft());
        node.el.addEventListener('scrollRight', () => node.scrollRight());
        /** Triggers when upward scroll occurs on this element
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.scrollUp = () => node.callback(() => console.log('ScrollUp', node));
        /** Triggers when downward scroll occurs on this element
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.scrollDown = () => node.callback(() => console.log('ScrollDown', node));
        /** Triggers when left-to-right scroll occurs on this element
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.scrollLeft = () => node.callback(() => console.log('ScrollLeft', node));
        /** Triggers when right-to-left scroll occurs on this element
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.scrollRight = () => node.callback(() => console.log('ScrollRight', node));
    }
}