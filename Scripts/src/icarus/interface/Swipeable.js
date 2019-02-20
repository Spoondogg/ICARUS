/** @module */
import IFACE from './IFACE.js';
//import Activate from '../../event/Activate.js';
/** An interface for Swipe driven Events
    @class
    @extends IFACE
*/
export default class Swipeable extends IFACE {
	/** A series of Swipe Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'swipeable');
		node.xDown = null;
		node.yDown = null;
	}
	addListeners(node) {
		node.el.addEventListener('touchstart', this.handleTouchStart.bind(node), {
			passive: true
		});
		node.el.addEventListener('touchmove', this.handleTouchMove.bind(node), {
			passive: true
		});
		node.el.addEventListener('swipeUp', () => node.swipeUp());
		node.el.addEventListener('swipeDown', () => node.swipeDown());
		node.el.addEventListener('swipeLeft', () => node.swipeLeft());
		node.el.addEventListener('swipeRight', () => node.swipeRight());
	}
	setMethods(node) {
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
	/** Sets start coordinates
		@param {Event} ev Event
	    @returns {void}
	*/
	handleTouchStart(ev) {
		this.xDown = ev.touches[0].clientX;
		this.yDown = ev.touches[0].clientY;
		ev.stopPropagation();
	}
	/** Process the swipe
	    @see https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
	    @param {Event} ev Event
	    @returns {void}
	*/
	handleTouchMove(ev) {
		if (!this.xDown || !this.yDown) {
			return;
		}
		var xUp = ev.touches[0].clientX;
		var yUp = ev.touches[0].clientY;
		var xDiff = this.xDown - xUp;
		var yDiff = this.yDown - yUp;
		let dir = '';
		if (Math.abs(xDiff) > Math.abs(yDiff)) { // Most significant
			dir = xDiff > 0 ? 'left' : 'right';
			if (xDiff > 0) {
				this.swipeLeft();
			} else {
				this.swipeRight();
			}
		} else if (yDiff > 0) {
			dir = 'up';
			this.swipeUp();
		} else {
			dir = 'down';
			this.swipeDown();
		}
		console.log(this.className + ' ' + dir + ' swipe');
		// Reset Values
		this.xDown = null;
		this.yDown = null;
		ev.stopPropagation();
	}
}