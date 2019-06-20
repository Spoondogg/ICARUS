/** @module */
import CONTAINER, { Activate, Deactivate } from '../container/CONTAINER.js';
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
        this.implement(new Swipeable(this, parseInt(getComputedStyle(this.el).width) * 0.85, true, true));
		this.swipeUp = () => {
			console.log('swipeUp');
			let { navheader } = this.getContainer();
			this.getMain().focusBody().then(() => {
				if (this.getContainer().body.hasClass('active')) {
					if (navheader.hasClass('active')) {
						navheader.el.dispatchEvent(new Deactivate(navheader));
					}
				}
			});
		};
		this.swipeDown = () => {
			console.log('swipeDown');
			let { navheader } = this.getContainer();
			this.getMain().focusBody().then(() => {
				if (this.getContainer().body.hasClass('active')) {
					if (!navheader.hasClass('active')) {
						navheader.el.dispatchEvent(new Activate(navheader));
					}
				}
			});
		};
		this.swipeLeft = () => {
			let [navMenu] = this.getMain().navheader.tabs.get('sidebar-user', 'NAVITEMICON');
			navMenu.el.dispatchEvent(new Activate(navMenu));
		};
		this.swipeRight = () => {
			let [navMenu] = this.getMain().navheader.tabs.get('document-map', 'NAVITEMICON');
			navMenu.el.dispatchEvent(new Activate(navMenu));
		};
	}
}
export { CONTAINER, EL, MODEL }