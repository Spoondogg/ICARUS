/** @module */
//import { ATTR, DATA, MODELS } from '../../../enums/DATAELEMENTS.js';
import SPAN, { ATTR, ATTRIBUTES, DATA, EL, MODEL, MODELS } from './SPAN.js';
import { ICONS } from '../../../enums/ICONS.js';
/** Bootstrap 3 Glyph Icon
    @class
*/
export default class GLYPHICON extends SPAN {
	/** Construct a Glyphicon
	    @param {EL} node Node
        @param {IconModel} [model] Model
	*/
	constructor(node, model = MODELS.icon()) {
		super(node, model);
		this.addClass('icon glyphicon ' + model.data.icon || ICONS.BLANK);
	} 
	/** Sets the ICON class to the given glyphicon
        @param {string} icon Icon
        @returns {void}
    */
    setIcon(icon) {
        this.setClass('icon glyphicon ' + icon);
	}
}
export { ATTR, ATTRIBUTES, DATA, EL, ICONS, MODEL, MODELS, SPAN }