/** @module */
import MENU, { MODEL } from '../../nav/menu/MENU.js';
import MODAL from '../MODAL.js';
/** A modal prompt.
    @description Creates a modal and displays a text well and any buttons that have
    been added.
    @class
    @extends MODAL
*/
export default class MODALMENU extends MODAL {
	/** @param {string} label The label
	    @param {string} text The html text that is displayed in the prompt's well
	    @param {array} children Array of [label, glyphicon, buttonType]
	    @param {boolean} vertical If true, prompt is vertically centered
	*/
	constructor(label, text, children, vertical) {
		super(label, text, vertical);
		this.addClass('prompt');
		this.container.addContainerCase('MENU');
		this.menu = new MENU(this.container.body.pane, new MODEL().set('name', 'menu'));
	}
	/** Perform any async actions and populate this Container
	    @param {MODEL} model Model
	    @returns {Promise<ThisType>} callback
	*/
	construct(model) {
		return this.menu.populate(model.children);
	}
}