/** @module */
import EL, { ATTRIBUTES, MODEL } from '../EL.js';
import INPUTMODEL from './INPUTMODEL.js';
/** An INPUT element */
export default class INPUT extends EL {
    /** Constructs a generic INPUT Element
        @param {EL} node Node
        @param {INPUTMODEL} model Model
    */
    constructor(node, model) {
		super(node, 'INPUT', model);
	}
}
export { ATTRIBUTES, EL, INPUTMODEL, MODEL }