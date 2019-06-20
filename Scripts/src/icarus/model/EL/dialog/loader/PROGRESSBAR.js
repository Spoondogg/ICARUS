/** @module */
import DIV, { EL, MODEL } from '../../div/DIV.js';
/** A horizontal progress bar
    @class
    @extends EL
*/
export default class PROGRESSBAR extends EL {
    /** Constructs a Progress Bar
	    @param {EL} node Parent Node
	    @param {MODEL} [model] Model
	*/
    constructor(node, model) {
		super(node, 'DIV', model);
		this.addClass('progress-bar progress-bar-info progress-bar-striped active noselect');
		this.el.setAttribute('role', 'progressbar');
		this.el.setAttribute('aria-valuenow', 0);
		this.el.setAttribute('aria-valuemin', 0);
		this.el.setAttribute('aria-valuemax', 100);
        this.text = new DIV(this, new MODEL('text'));
        this.type = 'info';
    }
    /** Sets the style type for this progress bar
        @param {string} type ie success, info, warning, danger
        @returns {void}
    */
    setType(type = 'info') {
        if (this.type !== type) {
            let currentClass = 'progress-bar-' + this.type;
            this.removeClass(currentClass);
            this.addClass('progress-bar-' + type);
            this.type = type;
        }
    }
}
export { DIV, EL, MODEL }