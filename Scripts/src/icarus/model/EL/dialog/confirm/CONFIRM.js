/** @module */
import PROMPT, { ATTR, ATTRIBUTES, DATA, DIALOG, DIV, EL, ICONS, MODEL, MODELS } from '../prompt/PROMPT.js';
/** A DIALOG with an embedded FORM that can be used to recieve input
    @description Creates a modal and displays a text well and any included buttons
    @class
*/
export default class CONFIRM extends DIALOG {
	/** Constructs a CONFIRM Dialog
        @param {DialogModel} model Model
        @param {Function} onConfirm Function called on confirm
        @param {Function} [onCancel] Function called on cancel
    */
	constructor(model, onConfirm, onCancel = null) {
        super(model);
        this.addClass('confirm');
        this.onConfirm = onConfirm;
        if (onCancel !== null) {
            this.onCancel = onCancel;
        }
        this.btnConfirm = this.footer.buttonGroup.addButton(MODELS.button(ATTR.button(), DATA.button('Confirm', ICONS.CONFIRM)));
        this.btnConfirm.el.addEventListener('click', () => {
            this.onConfirm();
            this.closeDialog();
        });
        $(this.btnConfirm.el).insertBefore(this.footer.buttonGroup.get()[0].el);
        
        this.btnCancel = this.footer.buttonGroup.addButton(MODELS.button(ATTR.button(), DATA.button('Cancel', ICONS.CANCEL)));
        this.btnCancel.el.addEventListener('click', () => {
            this.onCancel();
            this.closeDialog();
        });
        $(this.btnCancel.el).insertAfter(this.btnConfirm.el);
    }
    /** Function to call when PROMPT is confirmed
        @returns {void}
    */
    onConfirm() {
        console.log('CONFIRMED!');
    }
    /** Function to call when PROMPT is cancelled
        @returns {void}
    */
    onCancel() {
        console.log('CANCELLED!');
    }
    /** Confirms before calling method
        @param {string} label PROMPT Label
        @param {string} text PROMPT Text
        @param {Function} onConfirm Function called on confirm
        @param {Function} onCancel Function called on cancel
        @returns {void}
    */
    static confirmMethodCall(label, text, onConfirm, onCancel) {
        let confirm = new CONFIRM(MODELS.dialog(label, text, true, null, null, null), onConfirm, onCancel);
        confirm.showDialog();
    }
}
export { ATTR, ATTRIBUTES, DATA, DIALOG, DIV, EL, MODEL, PROMPT }