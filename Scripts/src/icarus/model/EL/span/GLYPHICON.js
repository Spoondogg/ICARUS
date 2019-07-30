/** @module */
import SPAN, { ATTRIBUTES, EL, MODEL } from './SPAN.js';
import { ICONS } from '../../../enums/ICONS.js';
import { MODELS } from '../../../enums/DATAELEMENTS.js';
/** Bootstrap 3 Glyph Icon
    @class
    @extends SPAN
*/
export default class GLYPHICON extends SPAN {
	/** Construct a Glyphicon
	    @param {EL} node Node
        @param {IconModel} [model] Model
	*/
	constructor(node, model = MODELS.icon()) {
		super(node, model);
		this.addClass('icon glyphicon ' + model.icon || ICONS.BLANK);
	} 
	/** Sets the ICON class to the given glyphicon
        @param {string} icon Icon
        @returns {void}
    */
    setIcon(icon) {
        this.setClass('icon glyphicon ' + icon);
	}
}
export { ATTRIBUTES, EL, ICONS, MODEL, MODELS, SPAN }