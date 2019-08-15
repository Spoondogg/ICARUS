/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import { ATTR, MODELS } from '../../../enums/DATAELEMENTS.js';
/** An INPUT element */
export default class INPUT extends EL {
    /** Constructs a generic INPUT Element
        @param {EL} node Node
        @param {InputModel} model Model
    */
    constructor(node, model = MODELS.input()) {
        super(node, 'INPUT', model);
	}
}
export { ATTR, ATTRIBUTES, EL, MODEL, MODELS }