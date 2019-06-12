/** @module */
import DIALOG, { ATTRIBUTES, DIALOGMODEL, DIV, EL, ICONS, MODEL } from '../DIALOG.js';
//import FORM from '../../form/FORM.js';
/** A DIALOG with an embedded FORM that can be used to recieve input
    @description Creates a modal and displays a text well and any included buttons
    @class
    @extends DIALOG
*/
export default class CONFIRM extends DIALOG {
	/** Constructs a CONFIRM Dialog
        @param {DIALOGMODEL} model DIALOG MODEL
        @param {Function} onConfirm Function called on confirm
        @param {Function} onCancel Function called on cancel
    */
	constructor(model, onConfirm, onCancel) {
        super(model);
        this.addClass('confirm');
        this.onConfirm = onConfirm;
        this.onCancel = onCancel;
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

    onCancel() {
        console.log('CANCELLED!');
    }

}
export { ATTRIBUTES, DIALOG, DIALOGMODEL, DIV, EL, MODEL }