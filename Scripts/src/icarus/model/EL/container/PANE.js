/** @module */
import CONTAINER, { Activate } from '../container/CONTAINER.js';
import DIV, { EL, MODEL } from '../div/DIV.js';
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
        this.implement(new Swipeable(this, 150));
        this.swipeUp = () => {
            this.getMain().focusBody();
            //console.log('collapsing navheader');
            this.getContainer().navheader.collapse();   
        };
        this.swipeDown = () => {
            this.getMain().focusBody();
            //console.log('expanding navheader');
            this.getContainer().navheader.expand();            
        };
        this.swipeLeft = () => {
            let [navMenu] = this.getMain().navheader.tabs.get('sidebar-user', 'NAVITEMICON');
            navMenu.el.dispatchEvent(new Activate(navMenu));
            //console.log('expanding navheader');
            //this.getContainer().navheader.expand();
        };
        this.swipeRight = () => {
            let [navMenu] = this.getMain().navheader.tabs.get('document-map', 'NAVITEMICON');
            navMenu.el.dispatchEvent(new Activate(navMenu));
            //console.log('expanding navheader');
            //this.getContainer().navheader.expand();
        };
    }
    
}
export { CONTAINER, EL, MODEL }