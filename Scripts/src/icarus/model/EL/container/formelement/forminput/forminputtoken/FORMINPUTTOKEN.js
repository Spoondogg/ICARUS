/** @module */
import INPUT, { ATTRIBUTES, EL, MODEL, MODELS } from '../../../../input/INPUT.js';
/** Represents an INPUT TOKEN for an Icarus Form
    @class
    @extends FORMINPUT
*/
export default class FORMINPUTTOKEN extends INPUT {
	/** Constructs a FORMINPUTTOKEN element
	    @param {EL} node Parent
	*/
	constructor(node) {
		super(node, MODELS.input(new MODEL(), {
			type: 'HIDDEN',
			name: '__RequestVerificationToken',
			value: document.getElementsByTagName('meta').token.content
		}));
	}
}
export { ATTRIBUTES, EL, MODEL }