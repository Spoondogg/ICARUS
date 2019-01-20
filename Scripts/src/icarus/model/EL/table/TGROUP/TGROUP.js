/** @module */
import ROW, {
	COLUMN,
	EL,
	MODEL
} from './row/ROW.js';
/** A TABLE GROUP (TGROUP) element: ie: THEAD, TBODY, TFOOT */
export default class TGROUP extends EL {
	/** Constructs a table group element
        @param {EL} node Parent
        @param {MODEL} model The model
    */
	constructor(node, model) {
		super(node, model.element, model);
		this.rows = []; // Array<ROW>
		this.addRows(model.rows);
	}
	/** Creates a row and appends to this
	    @param {MODEL} model The row model
	    @returns {ROW} The row
	*/
	addRow(model) {
		this.rows.push(new ROW(this, model));
		return this.rows[this.children.length - 1];
	}
	/** Adds groups to the table
	    @param {Array<TGROUP>} rows An array of groups
	    @returns {void}
	*/
	addRows(rows) {
		rows.forEach((row) => {
			this.addRow(row);
		});
	}
}
export {
	COLUMN,
	EL,
	MODEL
}