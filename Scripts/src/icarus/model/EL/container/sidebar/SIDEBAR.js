/** @module */
import EL, { MODEL } from '../../EL.js';
import NAVBAR, { Expand } from '../../nav/navbar/NAVBAR.js';
import Switchable, { Activate, Deactivate } from '../../../../interface/Switchable.js';
import Swipeable from '../../../../interface/Swipeable.js';
import { TransitionSpeed } from '../../../../enums/StyleVars.js';
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
		this.implement(new Swipeable(this, parseInt(getComputedStyle(this.el).width) * 0.75, true, true));
		this.implement(new Switchable(this));
		this.navbar = new NAVBAR(this, new MODEL());
		this.navbar.el.dispatchEvent(new Expand(this.navbar));
        this.setAlignmentOptions(model.align || 'left');
        this.scrollTarget = null;
		// Override activate/deactivate for custom animation timing
        this.activate = () => {
            if (!this.hasClass('active')) {
                this.removeClass('hidden');
                this.addClass('active');
                this.getMain().body.pane.addClass('focus-' + this.align);
            }
		}
        this.deactivate = () => {
            if (this.hasClass('active')) {
                this.getMain().body.pane.removeClass('focus-' + this.align);
                this.removeClass('active').then((sidebar) => setTimeout(() => sidebar.addClass('hidden'), TransitionSpeed));
            }
		}
		// Default state
		this.deactivate();
    }
    /** Scrolls the sidebar to the given reference
        @param {CONTAINER} node Container node
        @returns {Promise<ThisType>} Promise chain
    */
    scrollToReference(node) {
        return this.chain(() => {
            // Activate the reference tab
            let [tab] = node.reference.tabs.get(null, 'NAVITEMICON');
            if (!tab.hasClass('active')) {

                // Activate the actual node to trigger a cascade of activations up to the linked list head
                if (!node.hasClass('active')) {
                    node.el.dispatchEvent(new Activate(node));
                }

                tab.el.dispatchEvent(new Activate(tab));

                // Scroll
                this.scrollTarget = tab;
                setTimeout(() => {
                    console.log('Scrolling to reference', this.scrollTarget.toString());
                    if (this.scrollTarget !== null) {
                        $(this.el).animate({
                            scrollTop: parseInt($(this.scrollTarget.el).offset().top)
                        }, 600, 'swing');
                        this.scrollTarget = null;
                    }
                }, 500);
            }
        });
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