/** @module */
import SPAN, { ATTRIBUTES, EL, MODEL } from './SPAN.js';
/** An icon button that toggles a dropdown
    @class
    @extends SPAN
*/
export default class CARET extends SPAN {
	/** Construct an Icon button to toggle a dropdown
        @param {EL} node Parent element
    */
	constructor(node) {
        super(node);
        this.addClass('caret');
	}
}
export { ATTRIBUTES, EL, MODEL }