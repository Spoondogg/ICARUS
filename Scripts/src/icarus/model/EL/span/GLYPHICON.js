/** @module */
import SPAN, { ATTRIBUTES, EL, MODEL } from './SPAN.js';
import { ICONS } from '../../../enums/ICONS.js';
/** Bootstrap 3 Glyph Icon
    @class
    @extends SPAN
*/
export default class GLYPHICON extends SPAN {
	/** Construct a Glyphicon
	    @param {EL} node Node
	    @param {string} glyphicon The bootstrap glyphicon or ICON enum
	*/
	constructor(node, glyphicon) {
		super(node);
		this.addClass('icon glyphicon ' + glyphicon);
	}
	/** Sets the ICON class to the given glyphicon
        @param {string} glyphicon The glyphicon name
        @returns {void}
    */
    setIcon(glyphicon) {
        this.setClass('icon glyphicon ' + glyphicon);
	}
}
export { ATTRIBUTES, EL, ICONS, MODEL, SPAN }