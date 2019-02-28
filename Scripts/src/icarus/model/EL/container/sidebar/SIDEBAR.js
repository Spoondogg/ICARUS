/** @module */
//import CONTAINER, { MODEL } from '../CONTAINER.js';
import EL, { MODEL } from '../../EL.js';
import Switchable, { Deactivate } from '../../../../interface/Switchable.js';
import Swipeable from '../../../../interface/Swipeable.js';
//import { ALIGN } from '../../../../enums/ALIGN.js';
/** A Sidebar Container
    @class
    @extends EL
*/
export default class SIDEBAR extends EL {
	/** A Sidebar Container Element
	    @param {CONTAINER} node Parent Container (Typically MAIN)
	    @param {MODEL} model Model
	*/
	constructor(node, model = new MODEL().set('name', 'sidebar')) {
		super(node, 'ASIDE', model);
        this.addClass('sidebar');
        this.implement(new Swipeable(this, parseInt(getComputedStyle(this.el).width) * 0.75));
        this.implement(new Switchable(this));
        this.align = model.align || 'left';
        if (this.align === 'left') {
            this.swipeLeft = () => {
                //this.deactivate();
                this.tab.el.dispatchEvent(new Deactivate()); //.deactivate();
            }
        } else {
            this.swipeRight = () => {
                //this.deactivate();
                this.tab.el.dispatchEvent(new Deactivate()); //.deactivate();
            }
        }
        this.addClass(this.align);
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
    
}
export { MODEL }