/** @module */
import CONTAINER, { Clickable, EL, Expand, MODEL } from '../../container/CONTAINER.js';
import TABLE from '../TABLE.js';
import TD from './row/column/TD.js';
import TH from './row/column/TH.js';
import TR from './row/TR.js';
/** A TABLE GROUP (TGROUP) element: ie: THEAD, TBODY, TFOOT */
export default class TGROUP extends CONTAINER {
	/** Constructs a table group element
        @param {EL} node Parent
        @param {string} element HTML element Tag
        @param {MODEL} model The model
    */
	constructor(node, element, model) {
        super(node, element, model, ['TR']);
        this.addClass('table-group');
        this.implement(new Clickable(this));
    }
    constructElements() {
        return Promise.resolve();
    }
	/** Adds the given table-row to this table-group
	    @param {MODEL} model Object model
	    @returns {TR} A Table row
	*/
    addTr(model) {
        return this.addChild(new TR(this.childLocation, model, this.className === 'TBODY' ? ['TD'] : ['TH']));
    }
    /** Returns this group's table
        @returns {TABLE} Table
    */
    getTable() {
        return this.getProtoTypeByClass('TABLE');
    }

    getRows() {
        return this.get(null, 'TR');
    }
}
export { CONTAINER, EL, Expand, MODEL, TABLE, TD, TH, TR }