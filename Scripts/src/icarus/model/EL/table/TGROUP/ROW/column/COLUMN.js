/** @module */
import CONTAINER, { Activate, Clickable, Deactivate, EL, Expand, MODEL } from '../../../../container/CONTAINER.js';
import TGROUP, { TR } from '../../TGROUP.js';
/** A Column that exists inside a Row */
export default class COLUMN extends EL {
	/** Constructs a table group element
        @param {EL} node Parent
        @param {string} element HTML element Tag
        @param {MODEL} model The model
    */
    constructor(node, element, model) {
        super(node, element, model, []);
        this.addClass('table-column');
        this.implement(new Clickable(this));
        //this.removeAttribute('draggable');
        //this.deactivateSiblingsOnActivate = false;
        //this.childLocation = this;
        this.el.addEventListener('activate', () => this.activateRow());
        this.el.addEventListener('deactivate', () => this.deactivateRow());
    }
    activateRow() {
        let row = this.getRow();
        //let siblings = row.get().filter((c) => c !== this);
        //console.log(this.toString() + '.siblings', siblings);
        //let colIndex = this.getIndex();
        //let rowIndex = row.getIndex();
        //console.log('Activate Column[' + colIndex + '], Row[' + rowIndex + ']', this, siblings);
        //siblings.forEach((s) => s.el.dispatchEvent(new Deactivate(s)));  
        row.el.dispatchEvent(new Activate(row));
        this.activateColumn();
    }
    /** Deactivate this column's row if no other columns are active
        @returns {void}
    */
    deactivateRow() {
        let row = this.getRow();
        //let siblings = row.get().filter((c) => c.hasClass('active'));
        let siblings = [...row.el.children].filter((c) => c.classList.contains('active') && c !== this.el);
        console.log(this.toString() + 'deactivateRow().siblings', siblings);
        if (siblings.length === 0) {
            row.el.dispatchEvent(new Deactivate(row));
        }
        //siblingsActive.forEach((s) => s.el.dispatchEvent(new Deactivate(s)));            
    }
    activateColumn() {
        let tGroup = this.getRow().getTGroup();
        if (tGroup.className !== 'TBODY') {
            //let rows = [...tGroup.el.children].filter((c) => c !== this.el);
            let rows = tGroup.get(null, 'TR');
            console.log('Activating column[' + this.getIndex() + '] in rows', rows);
            tGroup.getTable()
            rows.forEach((r) => {
                r.el.dispatchEvent(new Activate(r));
                //let col = r.get()[this.getIndex()];
                //col.el.dispatchEvent(new Activate(col));
            });
        }
    }
    /** Returns this row's table-group
        @returns {TR} Table Row
    */
    getRow() {
        return this.node;
    }
    /*constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                // SET
            } else {
                console.log('No data exists for ' + this.toString());
                this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
        });
    }*/
}
export { CONTAINER, EL, MODEL }