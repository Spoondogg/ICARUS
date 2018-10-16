/** @module */
import EL from '../EL.js';
/** A TEXTAREA element */
export default class TEXTAREA extends EL {
	/** Constructs a TEXTAREA element
        @param {EL} node Parent
        @param {MODEL} model The model
    */
	constructor(node, model) {
		super(node, 'TEXTAREA', model);
	}
}