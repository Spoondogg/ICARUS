/** @module */
import LIST, { Collapse, EL, Expand, MODEL } from '../LIST.js';
import { Switchable } from '../../../../interface/Clickable.js';
/** A console like panel (UL) that contains entries as list items (LI)
    @class
    @extends LIST
*/
export default class CONSOLE extends LIST {
	/** Construct a console
	    @param {EL} node Console parent
	    @param {MODEL} model Console model
	*/
	constructor(node, model = new MODEL().set('name', 'console')) {
		super(node, model);
        this.addClass('console');
        this.implement(new Switchable(this));
        this.el.addEventListener('activate', () => this.el.dispatchEvent(new Expand(this)));
        this.el.addEventListener('deactivate', () => this.el.dispatchEvent(new Collapse(this)));
	}
	/** Adds the given text as a list item to the console (UL) at the top of the list
	    @param {string} text Text to be added
        @param {boolean} toConsole If true, is also logged to console
        @param {string} type ie success, info, warning, danger
	    @returns {LI} The console entry
	*/
	addEntry(text, toConsole = false, type = 'info') {
		let li = this.addLI(new MODEL(type).set('innerHTML', text));
        $(this.el).animate({
            scrollTop: parseInt($(li.el).offset().top)
        }, 500, 'swing');

        if (toConsole) {
            console.log(text);
        }
		return li;
    }
    /** Flushes the contents of this console (this.children is not preserved)
        @see https://www.jstips.co/en/javascript/two-ways-to-empty-an-array/
        @returns {void}
    */
    flush() {
        //console.log(this.toString() + '.flush()', this.children);
        this.empty();
        this.children.length = 0;
        //console.log(this.toString() + '.flush().done()', this.children);
    }
}
export { Collapse, EL, Expand, MODEL, Switchable }