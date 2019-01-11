/** @module */
import IFACE, { EL } from '../IFACE.js';
/** An interface for Scroll and Wheel driven Events
    @class
    @extends IFACE
*/
export default class Scrollable extends IFACE {
	/** A series of Scroll and Wheel Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
    constructor(node) {
        super(node, 'scrollable');
    }
    addListeners(node) {
        node.el.addEventListener('scrollUp', () => node.scrollUp());
        node.el.addEventListener('scrollDown', () => node.scrollDown());
        node.el.addEventListener('scrollLeft', () => node.scrollLeft());
        node.el.addEventListener('scrollRight', () => node.scrollRight());
    }
    setMethods(node) {
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
    /** Enables scroll Up/Down from the current MENU
        @param {Event} event Event
        @returns {void}
    */
    scroll(event) {
        try {
            if (event.wheelDelta > 0) {
                console.log('scroll prev');
            } else {
                console.log('scroll next');
            }
        } catch (e) {
            if (e instanceof TypeError) {
                console.info('No element to scroll to');
            } else {
                throw e;
            }
        }
    }
}
export { EL }