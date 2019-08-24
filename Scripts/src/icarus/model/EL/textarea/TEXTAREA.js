/** @module */
import EL from '../EL.js';
/** A TEXTAREA element */
export default class TEXTAREA extends EL {
	/** Constructs a TEXTAREA element
        @param {EL} node Node
        @param {TextModel} model Model
    */
	constructor(node, model) {
		super(node, 'TEXTAREA', model);
	}
}