/** @module */
import DIV, { EL, MODEL } from '../div/DIV.js';
import CONTAINER from '../container/CONTAINER.js';
/** Containers have a 'body' that can contain an optional sidebar and detect swipe events
    @class
    @extends EL
*/
export default class CONTAINERBODY extends DIV {
	/** Construct a body with an optional sidebar
        @param {CONTAINER} node Parent
        @param {MODEL} model Object
	*/
	constructor(node, model) {
		super(node, model);
		this.setClass('container-body collapse in');
		//this.sidebar = null;
		this.pane = new DIV(this, new MODEL('pane'));
		// Add swipe detection for editing options in sidebar
		this.pane.el.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
		this.pane.el.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
		this.xDown = null;
		this.yDown = null;
	}
	/** Sets start coordinates
		@param {Event} ev Event
	    @returns {void}
	*/
	handleTouchStart(ev) {
		this.xDown = ev.touches[0].clientX;
        this.yDown = ev.touches[0].clientY;
        //ev.stopPropagation();
	}
	/** Process the swipe on body.pane
        @todo Move body.pane into its own PANE class
        @see https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
        @param {any} ev Event
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
		if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
			if (xDiff > 0) {
				console.log(this.className + 'left swipe');
			} else {
				console.log(this.className + 'right swipe');
			}
        } else if (yDiff > 0) {
            //let c = this.getContainer();
            let c = this.node;
            console.log(c.className + ' up swipe');
            c.swipeUp();
        } else {
            //let c = this.getContainer();
            let c = this.node;
            console.log(c.className + ' down swipe');
            c.swipeDown();
		}
		/* reset values */
		this.xDown = null;
        this.yDown = null;
        //ev.stopPropagation();
    }
	/** Toggle the collapsed state of this container
	    @returns {void}
	*/
	collapse() {
		$(this.el).collapse('toggle');
	}
}
export { CONTAINER, EL, MODEL };