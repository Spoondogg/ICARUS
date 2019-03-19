/** @module */
import EL, { MODEL } from '../../EL.js';
import NAVBAR, { Expand } from '../../nav/navbar/NAVBAR.js';
import Switchable, { Deactivate } from '../../../../interface/Switchable.js';
import Swipeable from '../../../../interface/Swipeable.js';
/** A Sidebar Container
    @class
    @extends EL
*/
export default class SIDEBAR extends EL {
	/** A Sidebar Container Element
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	*/
	constructor(node, model = new MODEL().set('name', 'sidebar')) {
		super(node, 'ASIDE', model);
		this.addClass('sidebar');
		this.implement(new Swipeable(this, parseInt(getComputedStyle(this.el).width) * 0.75));
        this.implement(new Switchable(this));
        this.navbar = new NAVBAR(this, new MODEL());
        this.navbar.el.dispatchEvent(new Expand(this.navbar));
        this.setAlignmentOptions(model.align || 'left');
		// Override activate/deactivate for custom animation timing
		this.activate = () => {
			this.removeClass('hidden');
			setTimeout(() => {
				this.addClass('active');
				this.getMain().body.pane.addClass('focus-' + this.align);
			}, 150);
		}
		this.deactivate = () => {
			this.getMain().body.pane.removeClass('focus-' + this.align);
			this.removeClass('active').then((sidebar) => setTimeout(() => sidebar.addClass('hidden'), 150));
		}
		// Default state
		this.deactivate();
    }
    /** Sets the SIDEBAR alignment and configures 'swipeLeft' and 'swipeRight' accordingly
        @param {string} align SIDEBAR alignment
        @returns {void}
    */
    setAlignmentOptions(align) {
        /** SIDEBAR alignment parameter
            @type {string}
        */
        this.align = align;
        if (this.align === 'left') {
            this.swipeLeft = () => this.tab.el.dispatchEvent(new Deactivate(this.tab));
        } else {
            this.swipeRight = () => this.tab.el.dispatchEvent(new Deactivate(this.tab));
        }
        this.addClass(this.align);
    }
}
export { EL, MODEL, NAVBAR }