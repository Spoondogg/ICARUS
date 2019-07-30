/** @module */
import BUTTON, { EL, ICONS, MODELS } from '../BUTTON.js';
import Clickable, { Activate, Deactivate } from '../../../../interface/Clickable.js';
//import { LongclickDelay } from '../../../../enums/StyleVars.js';
/** Button that can be switched on or off
    @class
    @extends BUTTON
*/
export default class SWITCH extends BUTTON {
	/** Construct a switchable button that can be toggled on/off
	    @param {EL} node Node
        @param {ButtonModel} model Model
	*/
	constructor(node, model) {
        super(node, model);
        this.implement(new Clickable(this));
    }
    /** Creates a Clickable Options constructor
        @returns {function(): ClickableOptions} ClickableOptions Constructor
    
    createOptions() {
        return this.makeStruct([
            ['label', ''],
            ['delay', 200],
            ['longClickDelay', LongclickDelay],
            ['stopPropagation', true]
        ]);
    }*/
}
export { Activate, BUTTON, Deactivate, EL, ICONS, MODELS }