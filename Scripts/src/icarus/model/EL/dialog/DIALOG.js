/** @module */
//import BUTTONGROUP, { ALIGN, BUTTON } from '../group/buttongroup/BUTTONGROUP.js';
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import FORMFOOTER, { ALIGN, BUTTON } from '../form/FORMFOOTER.js'; // , { ALIGN, BUTTON }
import DIV from '../div/DIV.js';
import HEADER from '../header/HEADER.js';
import { ICONS } from '../../../enums/ICONS.js';
import NAVBAR from '../nav/navbar/NAVBAR.js';
/** An HTML5 Dialog Element (Only supported in Chrome as of 2018-09-28)
    @class
    @extends EL
    @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
    @see https://webdesign.tutsplus.com/tutorials/native-popups-and-modals-with-the-html5-dialog-element--cms-23876
    @see https://github.com/GoogleChrome/dialog-polyfill
    @see https://keithjgrant.com/posts/2018/01/meet-the-new-dialog-element/
*/
export default class DIALOG extends EL {
	/** Constructs a generic DIALOG Element or uses a polyfill
	    @constructs DIALOG
	    @param {MODEL} model The object model
	*/
	constructor(model) {
        //super(document.body, 'DIALOG', model);
        super(document.body, 'DIV', model);
        this.addClass('modal');
        //this.addClass('animated');
        this.el.setAttribute('role', 'dialog');
        //dialogPolyfill.registerDialog(this.el);
        //this.addClass('hiding');
        this.container = model.container;
        document.body.insertBefore(this.el, document.body.firstChild);
        
		this.header = new HEADER(this, new MODEL().set({
			label: model.label
        }));
		this.navBar = new NAVBAR(this, new MODEL().set({
			label: this.label
		}));
		//this.navBar.show();
		this.btnClose = new BUTTON(this.header, 'x');
		this.btnClose.el.onclick = () => this.close(300);
		this.body = new DIV(this, new MODEL('body'), model.text); // .setInnerHTML(model.text)
		this.footer = new FORMFOOTER(this, new MODEL().set({
			align: ALIGN.VERTICAL
		}));
        this.footer.buttonGroup.addButton('CLOSE', ICONS.CLOSE).el.onclick = () => this.close();      
        this.closeOnFocusOut();

        // Set animations @see https://www.w3schools.com/bootstrap/bootstrap_ref_js_modal.asp
        $(this.el).on('show.bs.modal', () => {
            this.removeClass('hiding');
            //this.addClass('bounce');
        }).on('hide.bs.modal', () => {
            //this.removeClass('bounce');
            this.addClass('hiding');
        }).on('hidden.bs.modal', () => {

        }).on('shown.bs.modal', () => {

        });
    }
    /** When DIALOG loses focus, it will be closed
        @returns {void}
    */
    closeOnFocusOut() {
        this.el.onclick = (event) => {
            if (event.target === this.el) {
                this.close();
            }
        };
    }
	/** Shows the DIALOG and adds the 'open' attribute
        Hides all visible DIALOG(s)
        @param {number} delay Millisecond delay until dialog is shown
	    @returns {Promise} Callback on successful display of dialog
	*/
	show(delay = 0) {
		return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    //this.el.showModal(); // DIALOG method
                    $(this.el).modal('show');
                    //this.removeClass('hiding');
                    resolve(this);
                } catch (e) {
                    if (e instanceof DOMException) {
                        resolve(this);
                    } else {
                        reject(e);
                    }
                }
            }, delay);
		});
	}
	/** Closes the DIALOG by hiding it and then removing it from the DOM
        @param {number} delay Millisecond delay until dialog is closed
	    @returns {Promise} Callback on successful close
	*/
    close(delay = 200) {
        return this.hide(delay, false);
    }
    /** Hides the DIALOG
        @param {number} delay Millisecond delay until dialog is closed
        @param {boolean} preserve If true, element is not deleted
	    @returns {Promise} Callback on successful close
    */
    hide(delay = 200, preserve = true) {
        return new Promise((resolve, reject) => {
            try {
                this.addClass('hiding');
                setTimeout(() => {
                    //this.el.close(); // DIALOG method
                    $(this.el).modal('hide');
                    if (preserve) {
                        resolve();
                    } else {
                        this.destroy().then(() => {
                            resolve();
                        });
                    }
                }, delay);
            } catch (e) {
                reject(e);
            }
        });
    }    
    /** Overrides CONTAINER logic for DIALOG
        @returns {CONTAINER} The DIALOG Container (MAIN)
    */
    getContainer() {
        return this.container;
    }
    /** Overrides CONTAINER logic for DIALOG
        @returns {CONTAINER} The DIALOG Container (MAIN)
    */
    getMainContainer() {
        return this.container;
    }
}
export { ATTRIBUTES, DIV, EL, MODEL };