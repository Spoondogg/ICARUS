/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import BUTTON from '../button/BUTTON.js';
import DIV from '../div/DIV.js';
import FOOTER from '../footer/FOOTER.js';
import HEADER from '../header/HEADER.js';
import { ICONS } from '../../../enums/ICONS.js';
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
		document.body.insertBefore(this.el, document.body.firstChild);
		this.header = new HEADER(this, new MODEL('modal-header'));
		this.body = new DIV(this, new MODEL('modal-body'), model.text); // .setInnerHTML(model.text)
		this.footer = new FOOTER(this, new MODEL('modal-footer'));
		this.btnClose = new BUTTON(this.footer, 'CLOSE', ICONS.CLOSE).addClass('btn-block');
		this.btnClose.el.onclick = () => {
			this.close();
		}
	}
	/** Makes modal appear (adds `open` attribute)
        @param {number} delay Millisecond delay until dialog is shown
	    @returns {void}
	*/
	expand(delay = 0) {
		setTimeout(() => {
			this.el.showModal();
		}, delay);
	}
	/** Hides the modal
        @param {number} delay Millisecond delay until dialog is closed
        @param {boolean} preserve If true, element is not deleted
	    @returns {void}
	*/
	close(delay = 0, preserve = false) {
		setTimeout(() => {
			this.el.close();
			if (!preserve) {
				this.destroy();
			}
		}, delay);
	}
}
export { ATTRIBUTES, DIV, EL, MODEL };