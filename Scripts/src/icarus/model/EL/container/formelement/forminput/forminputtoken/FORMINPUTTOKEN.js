/** @module */
import INPUT, { ATTRIBUTES, EL, MODEL, MODELS } from '../../../../input/INPUT.js';
/** Represents an INPUT TOKEN for an Icarus Form
    @class
    @extends FORMINPUT
*/
export default class FORMINPUTTOKEN extends INPUT {
	/** Constructs a FORMINPUTTOKEN element
	    @param {EL} node Node
	*/
	constructor(node) {
		super(node, MODELS.input('INPUT', MODELS.inputAttributes(
            '__RequestVerificationToken',
            document.getElementsByTagName('meta').token.content,
            'HIDDEN'
		)));
	}
}
export { ATTRIBUTES, EL, MODEL }