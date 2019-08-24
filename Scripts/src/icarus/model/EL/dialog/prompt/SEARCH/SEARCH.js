/** @module */
import MENU, { ATTR, Expand, MODELS } from '../../../nav/menu/MENU.js';
import PROMPT, { ATTRIBUTES, DIALOG, DIV, EL, ICONS, MODEL } from '../PROMPT.js';
/** A Prompt that has a form configured as a SEARCH
    @description Creates a modal and displays a text well and any included buttons
    @class
*/
export default class SEARCH extends PROMPT {
	/** Constructs a SEARCH
        @param {DialogModel} model Model
    */
	constructor(model) {
		super(model);
        this.addClass('prompt-search');
        this.results = new MENU(this.body.pane, MODELS.menu(ATTR.menu('results', 'search-results')));
        this.results.el.dispatchEvent(new Expand(this.results));
    }
}
export { ATTRIBUTES, DIALOG, DIV, EL, ICONS, MODEL, PROMPT }