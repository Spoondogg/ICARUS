/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import FORMFOOTER, { ALIGN } from '../form/FORMFOOTER.js';
import Closeable from '../../../interface/Closeable/Closeable.js';
import DIV from '../div/DIV.js';
import HEADER from '../header/HEADER.js';
import { ICONS } from '../../../enums/ICONS.js';
import NAVBAR from '../nav/navbar/NAVBAR.js';
import SWITCH from '../button/switch/SWITCH.js';
/** An HTML5 Dialog Element (Only supported in Chrome as of 2018-09-28)
    @class
    @extends EL
*/
export default class DIALOG extends EL {
	/** Constructs a generic DIALOG Element
	    @constructs DIALOG
	    @param {MODEL} model The object model
	*/
	constructor(model) { // container
		super(document.body, 'DIV', model);
		this.addClasses(['dialog', 'modal']);
		this.implement(new Closeable(this));
		this.show = () => this.showDialog();
		this.close = () => this.closeDialog();
		this.hide = () => this.hideDialog();
		this.caller = this.required(model.caller); // Switchable Element
		this.container = this.required(model.container); // Container Element for callbacks
		this.header = new HEADER(this, new MODEL().set('label', model.label));
		this.btnClose = new SWITCH(this.header, 'x');
		this.btnClose.el.addEventListener('activate', () => this.closeDialog());
		this.navbar = new NAVBAR(this, new MODEL().set('label', model.label));
		//this.navbar.expand().then(navbar => navbar.menu.expand());		
		this.body = new DIV(this, new MODEL('body'), model.text); // .setInnerHTML(model.text)
		this.footer = new FORMFOOTER(this, new MODEL().set('align', ALIGN.VERTICAL));
		this.footer.buttonGroup.addButton('CLOSE', ICONS.CLOSE).el.onclick = () => this.closeDialog();
		this.closeOnFocusOut();
		// Set animations @see https://www.w3schools.com/bootstrap/bootstrap_ref_js_modal.asp
        $(this.el).on('show.bs.modal', () => this.removeClass('hiding'));
        $(this.el).on('hide.bs.modal', () => this.addClass('hiding'));
        $(this.el).on('hidden.bs.modal', () => { /**/ });
        $(this.el).on('shown.bs.modal', () => { /**/ });
	}
	/** When DIALOG loses focus, it will be closed
	    @returns {void}
	*/
	closeOnFocusOut() {
		this.el.onclick = (event) => event.target === this.el ? this.closeDialog() : this;
	}
	/** Overrides CONTAINER logic for DIALOG
	    @returns {Promise<CONTAINER>} The DIALOG Container (MAIN)
	*/
	getContainer() {
		return this.container;
	}
	/** Overrides CONTAINER logic for DIALOG
	    @returns {CONTAINER} The DIALOG Container (MAIN)
	*/
	getMain() {
		//return Promise.resolve(this.container);
		return this.container;
	}
	/** Shows the DIALOG
        @param {number} delay Millisecond delay until dialog is shown
	    @returns {Promise<DIALOG>} Callback on successful display of dialog
	*/
	showDialog(delay = 0) {
		return this.callback(() => setTimeout(() => $(this.el).modal('show'), delay));
	}
	/** Closes the DIALOG by hiding it and then removing it from the DOM
        @param {number} delay Millisecond delay until dialog is closed
	    @returns {Promise} Callback on successful close
	*/
	closeDialog(delay = 200) {
		return this.hideDialog(delay, false);
	}
	/** Hides the DIALOG and deactivates its caller
        @param {number} delay Millisecond delay until dialog is closed
        @param {boolean} preserve If true, element is not deleted
	    @returns {Promise<DIALOG>} Callback on successful close
    */
	hideDialog(delay = 200, preserve = true) {
		return new Promise((resolve, reject) => {
			try {
				this.addClass('hiding').then(() => setTimeout(() => {
					$(this.el).modal('hide');
					resolve(preserve ? this : this.destroy().then(() => this.caller.deactivate()));
				}, delay));
			} catch (e) {
				reject(e);
			}
		});
	}
}
export { ATTRIBUTES, DIV, EL, MODEL }