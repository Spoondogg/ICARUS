/** @module */
import BUTTONGROUP, { BUTTON, ICONS, MODELS } from '../../group/buttongroup/BUTTONGROUP.js';
import FOOTER, { EL, MODEL } from '../FOOTER.js';
import Collapsible from '../../../../interface/Collapsible.js';
/** A Footer containing a collection of page buttons
    @class
    @extends FOOTER
*/
export default class PAGINATION extends FOOTER {
	/** Constructs a Footer containing a collection of page buttons
	    @param {EL} node Node
	    @param {MODEL} [model] Model
	*/
    constructor(node, model) {
        super(node, model);
        this.addClass('pagination');
        this.el.setAttribute('style', 'text-align:center;'); // FIX ME!
        this.implement(new Collapsible(this));

        
        this.btnPrev = new BUTTON(this, MODELS.button('', ICONS.CHEVRON_LEFT));
        this.btnPrev.addClass('prev');
        this.btnPrev.el.onclick = () => this.prevPage();
        this.buttonGroup = new BUTTONGROUP(this);
        this.buttonGroup.loaded = false;
        this.btnNext = new BUTTON(this, MODELS.button('', ICONS.CHEVRON_RIGHT));
        this.btnNext.addClass('next');
        this.btnNext.el.onclick = () => this.nextPage();
    }
    /** Loads the next page in sequence
	    @returns {void}
	*/
    nextPage() {
        console.warn('PAGINATION.nextPage() has not been set');
    }
	/** Loads the previous page
        @returns {void}
    */
    prevPage() {
        console.warn('PAGINATION.prevPage() has not been set');
    }
}
export { EL, FOOTER, MODEL }