/** @module */
import CONTAINER, { Activate, Clickable, Deactivate, EL, MODEL } from '../../../../container/CONTAINER.js';
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
        this.el.addEventListener('activate', () => this.activateRow());
        this.el.addEventListener('deactivate', () => this.deactivateRow());
    }
    activateRow() {
        let row = this.getRow();
        row.el.dispatchEvent(new Activate(row));
        this.activateColumn();
    }
    /** Deactivate this column's row if no other columns are active
        @returns {void}
    */
    deactivateRow() {
        let row = this.getRow();
        let siblings = [...row.el.children].filter((c) => c.classList.contains('active') && c !== this.el);
        if (siblings.length === 0) {
            row.el.dispatchEvent(new Deactivate(row));
        }         
    }
    /** Deactivates all columns in this row, then activates this column
        @returns {void}
    */
    activateColumn() {
        let row = this.getRow();
        let { navheader } = this.getMain();
        let [sidebar] = navheader.menus.get('document-map', 'SIDEBAR');
        sidebar.scrollToReference(row);
        let [sidebarTab] = navheader.tabs.get('document-map', 'NAVITEMICON');
        sidebarTab.el.dispatchEvent(new Activate(sidebarTab));

        let siblings = [...row.el.children].filter((c) => c.classList.contains('active') && c !== this.el);
        siblings.forEach((s) => s.dispatchEvent(new Deactivate(s)));

        let tGroup = this.getRow().getTGroup();
        if (tGroup.className !== 'TBODY') {
            let rows = tGroup.get(null, 'TR');
            tGroup.getTable()
            rows.filter((r) => r.hasClass('active') === false).forEach((rr) => {
                rr.el.dispatchEvent(new Activate(rr));
            });
        }
    }
    /** Returns this row's table-group
        @returns {TR} Table Row
    */
    getRow() {
        return this.node;
    }
}
export { CONTAINER, EL, MODEL }