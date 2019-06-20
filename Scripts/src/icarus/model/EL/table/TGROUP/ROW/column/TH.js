/** @module */
import COLUMN, { EL, MODEL } from './COLUMN.js';
/** A Row that exists inside a table */
export default class TH extends COLUMN {
	/** Constructs a TH element
        @param {EL} node Parent
        @param {MODEL} model The model
    */
	constructor(node, model) {
        super(node, 'TH', model);
	}
}
export { COLUMN, EL, MODEL }