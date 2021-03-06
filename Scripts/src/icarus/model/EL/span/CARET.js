/** @module */
import SPAN, {
	ATTRIBUTES,
	MODEL
} from './SPAN.js';
/** An icon button that toggles a dropdown
    @class
    @extends SPAN
*/
export default class CARET extends SPAN {
	/** Construct an Icon button to toggle a dropdown
        @param {EL} node Parent element
    */
	constructor(node) {
		super(node, new MODEL('caret'));
	}
}
export {
	ATTRIBUTES,
	MODEL
};