/** @module */
import PROMPT, { ATTRIBUTES, DIALOG, DIALOGMODEL, DIV, EL, ICONS, MODEL } from '../prompt/PROMPT.js';
//import FORM from '../../form/FORM.js';
/** A DIALOG with an embedded FORM that can be used to recieve input
    @description Creates a modal and displays a text well and any included buttons
    @class
*/
export default class CONFIRM extends DIALOG {
	/** Constructs a CONFIRM Dialog
        @param {DIALOGMODEL} model DIALOG MODEL
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
        this.btnConfirm = this.footer.buttonGroup.addButton('Confirm', ICONS.CONFIRM);
        this.btnConfirm.el.addEventListener('click', () => {
            this.onConfirm();
            this.closeDialog();
        });
        $(this.btnConfirm.el).insertBefore(this.footer.buttonGroup.get()[0].el);
        
        this.btnCancel = this.footer.buttonGroup.addButton('Cancel', ICONS.CANCEL);
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
        let confirm = new CONFIRM(new DIALOGMODEL(new MODEL(), {
            container: null,
            caller: null,
            label,
            text
        }), onConfirm, onCancel);
        confirm.showDialog();
    }
}
export { ATTRIBUTES, DIALOG, DIALOGMODEL, DIV, EL, MODEL, PROMPT }