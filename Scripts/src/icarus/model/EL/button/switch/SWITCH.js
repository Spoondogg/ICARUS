/** @module */
import BUTTON from '../BUTTON.js';
import Clickable from '../../../../interface/Clickable/Clickable.js';
/** Button that can be switched on or off
    @class
    @extends BUTTON
*/
export default class SWITCH extends BUTTON {
	/** Construct a switchable button
	    @param {EL} node The parent object
	    @param {string} label The label
	    @param {string} glyphicon glyphicon
	    @param {string} buttonType buttonType
	*/
	constructor(node, label, glyphicon, buttonType) {
		super(node, label, glyphicon, buttonType);
		this.implement(new Clickable(this));
	}
}
export { BUTTON }