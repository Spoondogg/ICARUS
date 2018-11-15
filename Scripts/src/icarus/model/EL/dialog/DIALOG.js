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
	/** Constructs a generic DIALOG Element
	    @constructs DIALOG
	    @param {MODEL} model The object model
	*/
	constructor(model) {
        super(document.body, 'DIALOG', model);
        this.container = model.container;

		document.body.insertBefore(this.el, document.body.firstChild);
		this.header = new HEADER(this, new MODEL('modal-header').set({
			label: model.label
		}));
		this.navBar = new NAVBAR(this, new MODEL().set({
			label: this.label // model.label
		}));
		//this.navBar.show();
		this.header.btnClose = new BUTTON(this.header, 'x');
		this.header.btnClose.el.onclick = () => this.close(300);
		this.body = new DIV(this, new MODEL('modal-body'), model.text); // .setInnerHTML(model.text)
		this.footer = new FORMFOOTER(this, new MODEL().set({
			align: ALIGN.VERTICAL
		}));
		this.footer.buttonGroup.addButton('CLOSE', ICONS.CLOSE).el.onclick = () => this.close(300);
	}
	/** Makes modal appear (adds `open` attribute)
        @param {number} delay Millisecond delay until dialog is shown
	    @returns {Promise} Callback on successful display of dialog
	*/
	show(delay = 0) {
		return new Promise((resolve, reject) => {
			try {
				setTimeout(() => {
					this.el.showModal();
					resolve(this);
				}, delay);
			} catch (e) {
				reject(e);
			}
		});
	}
	/** Hides the modal
        @param {number} delay Millisecond delay until dialog is closed
        @param {boolean} preserve If true, element is not deleted
	    @returns {Promise} Callback on successful close
	*/
	close(delay = 0, preserve = false) {
		return new Promise((resolve, reject) => {
			try {
				setTimeout(() => {
					this.el.close();
					if (!preserve) {
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