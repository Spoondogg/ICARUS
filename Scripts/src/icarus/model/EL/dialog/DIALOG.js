/** @module */
import COLLAPSIBLE, { ATTRIBUTES, DIV, EL, MODEL } from '../container/COLLAPSIBLE.js';
import FORMFOOTER, { ALIGN } from '../form/FORMFOOTER.js';
import NAVHEADER, { Activate, Deactivate, Expand, MENU, NAVITEMICON } from '../nav/navbar/navheader/NAVHEADER.js';
import Closeable from '../../../interface/Closeable.js';
import DIALOGMODEL from './DIALOGMODEL.js';
import { ICONS } from '../../../enums/ICONS.js';
import Selectable from '../../../interface/Selectable.js';
/** An HTML5 Dialog Element (Only supported in Chrome as of 2018-09-28)
    @class
    @extends EL
*/
export default class DIALOG extends EL {
	/** Constructs a generic DIALOG Element
	    @constructs DIALOG
	    @param {DIALOGMODEL} model Dialog Model
        @param {boolean} [showHeader=true] If true (default), header is shown
	*/
	constructor(model, showHeader = true) {
		super(document.body, 'DIV', model);
		this.className = 'DIALOG';
		this.addClasses(['dialog', 'modal']);
		this.implement(new Closeable(this));
		this.implement(new Selectable(this));
		this.show = () => this.showDialog();
		this.close = () => this.closeDialog();
		this.hide = () => this.hideDialog();
        /** @type {EL} Element that called this DIALOG */
        this.caller = this.required(model.caller); // Switchable Element
        /** @type {Container} DIALOG Container/Holder */
		this.container = this.required(model.container); // Container Element for linked list head
		this.navheader = new NAVHEADER(this, new MODEL().set('label', model.label));
		this.btnClose = this.createCloseButton();
		if (showHeader) {
            this.navheader.el.dispatchEvent(new Expand(this.navheader));
		}
		this.body = new COLLAPSIBLE(this, new MODEL('body'), model.text);
        this.navheader.tab.el.dispatchEvent(new Activate(this.navheader.tab));
		this.footer = new FORMFOOTER(this, new MODEL().set('align', ALIGN.VERTICAL));
		this.footer.buttonGroup.addButton('CLOSE', ICONS.CLOSE).el.onclick = () => this.closeDialog();
		this.closeOnFocusOut();
		this.overrideBootstrap();
	}
	/** Creates a close button in the nav header
	    @returns {NAVITEMICON} Close Button / Icon
	*/
	createCloseButton() {
		let btn = this.navheader.tabs.addNavItemIcon(new MODEL('btn-close').set({
			label: 'close',
			icon: ICONS.CLOSE
		}));
		btn.el.addEventListener('activate', () => this.closeDialog());
		return btn;
	}
	/** When DIALOG loses focus, it will be closed
	    @returns {void}
	*/
	closeOnFocusOut() {
		this.el.onclick = (event) => event.target === this.el ? this.closeDialog() : this;
	}
	/** Shows the DIALOG
        @param {number} delay Millisecond delay until dialog is shown
	    @returns {Promise<DIALOG>} Callback on successful display of dialog
	*/
	showDialog(delay = 0) {
		return this.chain(() => setTimeout(() => $(this.el).modal('show'), delay));
	}
	/** Closes the DIALOG by hiding it and then removing it from the DOM
        @param {number} delay Millisecond delay until dialog is closed
	    @returns {Promise} Callback on successful close
	*/
	closeDialog(delay = 200) {
		return this.hideDialog(delay, false);
	}
	/** Hides the DIALOG and deactivates its caller
        @param {number} [delay=200] Millisecond delay until dialog is closed
        @param {boolean} [preserve=true] If true, element is not deleted
	    @returns {Promise<DIALOG>} Callback on successful close
    */
	hideDialog(delay = 200, preserve = true) {
		return new Promise((resolve, reject) => {
			try {
				this.addClass('hiding').then(() => setTimeout(() => {
					$(this.el).modal('hide');
                    resolve(preserve ? this : this.destroy().then(() => this.caller.el.dispatchEvent(new Deactivate(this.caller))));
				}, delay));
			} catch (e) {
				reject(e);
			}
		});
	}
	getContainer() {
		console.log('Getting dialog container');
		return this.container;
	}
	getMain() {
		try {
			return this.getContainer().getMain();
		} catch (e) {
			console.warn('Unable to get MAIN for DIALOG', this);
		}
	}
	overrideBootstrap() {
		// Set animations @see https://www.w3schools.com/bootstrap/bootstrap_ref_js_modal.asp
		$(this.el).on('show.bs.modal', () => this.removeClass('hiding'));
		$(this.el).on('hide.bs.modal', () => this.addClass('hiding'));
		//$(this.el).on('hidden.bs.modal', () => { /**/ });
		//$(this.el).on('shown.bs.modal', () => { /**/ });
	}
}
export { Activate, ATTRIBUTES, COLLAPSIBLE, Deactivate, DIALOGMODEL, DIV, EL, MENU, MODEL, NAVITEMICON }