/** @module */
import IFACE from './IFACE.js';
//import Activate from '../../event/Activate.js';
/** An interface for Swipe driven Events
    @class
    @extends IFACE
*/
export default class Swipeable extends IFACE {
	/** A series of Swipe Related Events and Methods
        @see https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        @param {EL} node Class to implement this interface (Typically 'this')
        @param {number} swipeSensitivity Pixel sensitivity for short/long scroll
        @todo Rather than pixel based, have swipeSensitivity use a % based on current total width/height
	*/
    constructor(node, swipeSensitivity = 50) {
		super(node, 'swipeable');
		node.xDown = null;
        node.yDown = null;
        node.swipeSensitivity = swipeSensitivity;
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
        ev.stopPropagation();
        this.xDown = ev.touches[0].clientX;
        this.yDown = ev.touches[0].clientY;
	}
	/** Process the swipe
	    @param {Event} ev Event
	    @returns {void}
	*/
    handleTouchMove(ev) {
        ev.stopPropagation();
        if (!this.xDown || !this.yDown) {
			return;
        }
        let xUp = ev.touches[0].clientX,
            yUp = ev.touches[0].clientY;
        let xDiff = this.xDown - xUp,
            yDiff = this.yDown - yUp;
        let dir = '',
            distance = Math.abs(xDiff) + Math.abs(yDiff);
        if (distance > this.swipeSensitivity) { // Handle short swipes
            if (Math.abs(xDiff) > Math.abs(yDiff)) { // Most significant difference 
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
            console.log(this.className + ' ' + dir + ' swipe', this);
            // Reset Values
            this.xDown = null;
            this.yDown = null;
        } /*else {
            console.log(this.className + ' Swipe Sensitivity', distance / this.swipeSensitivity);
        }*/
	}
}