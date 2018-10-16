/** @module */
import EL from '../../../EL.js';
import COLUMN from './column/COLUMN.js';
/** A Row that exists inside a table */
export default class ROW extends EL {
	/** Constructs a TR element
        @param {EL} node Parent
        @param {MODEL} model The model
    */
	constructor(node, model) {
        super(node, 'TR', model);
        this.columns = []; // Array<COLUMN>
        this.addColumns(model.columns);
    }
    /** Creates a column and appends to group/row
        @returns {COLUMN} A Column
    */
    addColumn(model) {
        this.columns.push(new COLUMN(this, model));
        return this.columns[this.columns.length - 1];
    };
    /** Adds columns to the row
        @param {Array<COLUMN>} columns An array of columns
    */
    addColumns(columns) {
        columns.forEach((col) => {
            this.addColumn(col);
        });
    }
}