/**
    @module
*/
import EL, { MODEL } from '../EL.js';
/**
    Containers have a 'body' that can contain an optional sidebar
    and detect swipe events
    @class
    @extends EL
 */
export default class CONTAINERBODY extends EL {
/**
    Construct a body with an optional sidebar
     @param {CONTAINER} node Parent
     @param {MODEL} model Object
 */
constructor(node, model) {
super(node, 'DIV', model);
this.setClass('container-body collapse in');
this.sidebar = null;
this.pane = new EL(this, 'DIV', new MODEL('pane'));
// Add swipe detection for editing options in sidebar
this.pane.el.addEventListener('touchstart', this.handleTouchStart, { passive: true });
this.pane.el.addEventListener('touchmove', this.handleTouchMove, { passive: true });
this.xDown = null;
this.yDown = null;
/*if (dev) {
    this.pane.el.ondblclick = function (e) {
        //node.toggleSidebar();
        console.log('Launch Editor for ' + node.className + '(' + node.id + ')');
        $(node.navBar.header.menu.el).collapse('show');
        node.btnSave.el.click();
        e.stopPropagation(); // Prevent parent double click()
    };
}*/
}
/**
	     Sets start coordinates
	     @param {Event} ev Event
         @returns {void}
	*/
handleTouchStart(ev) {
this.xDown = ev.touches[0].clientX;
this.yDown = ev.touches[0].clientY;
}
/**
	    Process the swipe on body.pane
	    Move body.pane into its own PANE class
	    @see https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
	    @param {any} evt Event
        @returns {void}
	 */
handleTouchMove(evt) {
if (!this.xDown || !this.yDown) {
return;
}
var xUp = evt.touches[0].clientX;
var yUp = evt.touches[0].clientY;
var xDiff = this.xDown - xUp;
var yDiff = this.yDown - yUp;
if (Math.abs(xDiff) > Math.abs(yDiff)) { /*most significant*/
if (xDiff > 0) {
console.log(this.className + 'left swipe');
} else {
console.log(this.className + 'right swipe');
}
} else if (yDiff > 0) {
console.log(this.className + ' up swipe');
} else {
console.log(this.className + ' down swipe');
}
/* reset values */
this.xDown = null;
this.yDown = null;
}
/**
	    Toggle the collapsed state of this container
        @returns {void}
	 */
collapse() {
$(this.el).collapse('toggle');
}
}