/** @module */
import COLUMN, { EL, MODEL } from './COLUMN.js';
/** A Row that exists inside a table */
export default class TD extends COLUMN {
	/** Constructs a TD element
        @param {EL} node Parent
        @param {MODEL} model The model
    */
	constructor(node, model) {
        super(node, 'TD', model);
	}
}
export { COLUMN, EL, MODEL }