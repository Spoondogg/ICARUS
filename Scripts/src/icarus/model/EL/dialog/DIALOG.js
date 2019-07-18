/** @module */
import COLLAPSIBLE, { ATTRIBUTES, DIV, EL, MODEL } from '../container/COLLAPSIBLE.js';
import Closeable, { Close, Open } from '../../../interface/Closeable.js';
import FORMFOOTER, { ALIGN } from '../form/FORMFOOTER.js';
import NAVHEADER, { Activate, Deactivate, MENU, NAVITEMICON } from '../nav/navbar/navheader/NAVHEADER.js';
import DIALOGMODEL from './DIALOGMODEL.js';
import { ICONS } from '../../../enums/ICONS.js';
import Selectable from '../../../interface/Selectable.js';
import { TransitionSpeed } from '../../../enums/StyleVars.js';
/* eslint-disable max-statements */
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
			this.navheader.expand();
		}
        this.body = new COLLAPSIBLE(this, 'DIV', new MODEL('body'));
        if (typeof model.text !== 'undefined') {
            this.text = new DIV(this.body.pane, new MODEL('text').set('innerHTML', model.text));
        }
		this.navheader.tab.el.dispatchEvent(new Activate());
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
        this.el.onclick = (event) => {
            if (event.target === this.el) {
                this.closeDialog();
            }
        }
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
    closeDialog(delay = TransitionSpeed) {
		return this.hideDialog(delay, false);
	}
	/** Hides the DIALOG and deactivates its caller
        @param {number} [delay] Millisecond delay until dialog is closed (Imports transition speed)
        @param {boolean} [preserve=true] If true, element is not deleted
	    @returns {Promise<DIALOG>} Callback on successful close
    */
    hideDialog(delay = TransitionSpeed, preserve = true) {
		return new Promise((resolve, reject) => {
            try {
                this.addClass('hiding').then(() => setTimeout(() => {
					$(this.el).modal('hide');
					resolve(preserve ? this : this.destroy().then(() => this.deactivateCaller()));
				}, delay));
			} catch (e) {
				reject(e);
			}
		});
    }
    /** Deactivates DIALOG caller if exists 
        @returns {void}
    */
    deactivateCaller() {
        if (this.caller !== null) {
            try {
                this.caller.deactivate();
            } catch (e) {
                console.warn('Unable to deactivate caller', this.caller.toString());
            }
        }
    }
    /** Dispatches a close event to all other DIALOGS 
        @returns {void} 
    */
    closeActiveDialogs() {
        // deactivate any active dialogs that arent this dialog
        let activeDialogs = $('.dialog.in');
        for (let t = 0; t < activeDialogs.length; t++) {
            if (activeDialogs[t] === this.el) {
                console.log('No need to deactivate this');
            } else {
                activeDialogs[t].dispatchEvent(new Close(activeDialogs[t]));
            }
        }
        /*activeTags.each((t) => {
        console.log('deactivate tag', activeTags[t]);
        if (activeTags[t] === btn.el) {
            console.log('No need to deactivate this');
        } else {
            activeTags[t].dispatchEvent(new Deactivate(activeTags[t]));
        }
        });*/
    }
	getContainer() {
		return this.container;
	}
    getMain(container = this.getContainer(), attempt = 1, recursionLimit = 100) {
        if (attempt < recursionLimit) {
            try {
                let main = container.getMain();
                if (main === null) {
                    return this.getMain(container.getContainer(), attempt + 1);
                }
                return main;
            } catch (e) {
                //return this.getContainer().getContainer().getMain();

                console.error('Unable to get MAIN for DIALOG', this);
            }
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
export { Activate, ATTRIBUTES, Close, COLLAPSIBLE, Deactivate, DIALOGMODEL, DIV, EL, ICONS, MENU, MODEL, NAVITEMICON, Open }
/* eslint-enable */