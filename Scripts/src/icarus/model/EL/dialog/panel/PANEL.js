/** @module */
import DIALOG, { ATTRIBUTES, EL, MODEL } from '../DIALOG.js';
import CONTAINER from '../../container/CONTAINER.js';
/** A vertically centered DIALOG
    @class
    @extends DIALOG
*/
export default class PANEL extends DIALOG {
	/** Constructs a PANEL
        @param {MODEL} model Model
    */
	constructor(model) {
		super(model);
        this.addClass('panel');
        /** Override MODAL Body with a Container
            @type {CONTAINER} 
        */
        this.body = new CONTAINER(this.body, 'DIV');
        this.body.container = model.container;
        this.body.getDialog = () => this;
        this.body.getContainer = () => model.container;
        this.body.getMain = () => this.getContainer().getMain();
    }
}
export { ATTRIBUTES, CONTAINER, DIALOG, EL, MODEL }