/** @module */
import IFACE from '../IFACE.js';
//import Activate from '../../event/Activate.js';
/** An interface for Click driven Events
    @class
    @extends INTERFACE
*/
export default class Swipeable extends IFACE {
	/** A series of Swipe Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        param {Event} eventOn Event to call if class does not yet exist
        param {Event} eventOff Event to call if class already exists
	*/
    constructor(node) {
        super(node);
        node.addClass('swipeable');
        node.el.addEventListener('swipeUp', () => node.swipeUp());
        node.el.addEventListener('swipeDown', () => node.swipeDown());
        node.el.addEventListener('swipeLeft', () => node.swipeLeft());
        node.el.addEventListener('swipeRight', () => node.swipeRight());
        /** Triggers when upward swipe occurs on this element
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.swipeUp = () => node.callback(() => console.log('Swipe Up', node));
        /** Triggers when downward swipe occurs on this element
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.swipeDown = () => node.callback(() => console.log('Swipe Down', node));
        /** Triggers when left-to-right swipe occurs on this element
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.swipeLeft = () => node.callback(() => console.log('Swipe Left', node));
        /** Triggers when right-to-left swipe occurs on this element
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.swipeRight = () => node.callback(() => console.log('Swipe Right', node));
    }
}