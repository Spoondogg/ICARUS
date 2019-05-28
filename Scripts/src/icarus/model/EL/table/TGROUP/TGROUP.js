/** @module */
import CONTAINER, { Activate, Deactivate, EL, Expand, MODEL } from '../../container/CONTAINER.js';
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
        this.removeAttribute('draggable');
        this.removeClass('draggable');
        this.deactivateSiblingsOnActivate = false;
        this.childLocation = this;
        this.body.destroy();
        this.el.addEventListener('activate', () => this.activateTGroup());
        this.el.addEventListener('deactivate', () => this.deactivateTGroup());
    }
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                // CREATE COLUMNS
            } else {
                console.log('No data exists for ' + this.toString());
                this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
        });
    }
	/** Adds the given table group to the table
	    @param {MODEL} model Object model
	    @returns {TGROUP} A Table group
	*/
    addTr(model) {
        return this.addChild(new TR(this.childLocation, model));
    }
    /** When a Table Group is activated, it is assumed that its table is also active
        @returns {void}
    */
    activateTGroup() {
        let table = this.getContainer();
        table.el.dispatchEvent(new Activate(table));
    }
    deactivateTGroup() {
        let table = this.getContainer();
        table.el.dispatchEvent(new Deactivate(table));
    }
    /** Returns this row's table
        @returns {TABLE} Table
    */
    getTable() {
        return this.node.node.node; // @todo Create getProtoByClassName
    }
}
export { CONTAINER, EL, Expand, MODEL, TABLE, TD, TH, TR }