/** @module */
import DIV, { EL, MODEL } from '../div/DIV.js';
import CONTAINER from '../container/CONTAINER.js';
import Swipeable from '../../../interface/Swipeable.js';
/** A panel with swipe detection
    @class
    @extends EL
*/
export default class PANE extends DIV {
	/** Construct a panel with swipe detection
        @param {CONTAINER} node Parent
        @param {MODEL} model Object
	*/
	constructor(node, model) {
		super(node, model);
		this.addClass('pane');
        this.implement(new Swipeable(this));
        this.swipeUp = () => {
            this.getMain().focusBody();
            //console.log('collapsing navheader');
            //this.getMain().navheader.collapse();
        };
        this.swipeDown = () => {
            this.getMain().focusBody();
            //console.log('expanding navheader');
            //this.getMain().navheader.expand();            
        };
    }
    
}
export { CONTAINER, EL, MODEL }