/** @module */
import CONTAINER, { Activate, Deactivate, EL, Expand, MODEL } from '../../../../container/CONTAINER.js';
import TR from '../TR.js';
/** A Column that exists inside a Row */
export default class COLUMN extends CONTAINER {
	/** Constructs a column within a table row
        @param {EL} node Parent
        @param {string} element HTML element Tag
        @param {MODEL} model The model
    */
    constructor(node, element, model) {
        super(node, element, model, []);
        this.addClass('table-column');
        this.childLocation = this;
        this.body.destroy();
        //this.implement(new Clickable(this));
        //this.el.addEventListener('activate', () => this.activateColumn());
        //this.el.addEventListener('deactivate', () => this.deactivateColumn());
    }
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                console.log('Data exists for ' + this.toString());
                this.createEditableElement('p', this.childLocation);
            } else {
                console.log('No data exists for ' + this.toString());
                this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
        });
    }
    /** Once the column has been activated, deactivates all other columns in this row
        @returns {void}
    */
    activateColumn() {        
        let row = this.getRow();

        if (row.hasClass('active')) {
            //let activeColumns = [...row.el.children].filter((c) => c.classList.contains('active') && c !== this.el);
            let activeColumns = row.get(null, this.className).filter((c) => c.hasClass('active') && c !== this);
            console.log('Active sibling columns', activeColumns);
            activeColumns.forEach((c) => c.el.dispatchEvent(new Deactivate(c)));
        }/* else {
            row.el.dispatchEvent(new Activate(row));
        }*/
        //this.chain(() => {
            
            let { navheader } = this.getMain();
            let [sidebarTab] = navheader.tabs.get('document-map', 'NAVITEMICON');
            sidebarTab.el.dispatchEvent(new Activate(sidebarTab));
            let [sidebar] = navheader.menus.get('document-map', 'SIDEBAR');
            sidebar.scrollToReference(row);
        //});
    }
    /** If all siblings are deactivated, deactivate parent row
        @param {TR} row Table Row for this column
        @returns {void}
    */
    deactivateColumn(row = this.getRow()) {
        //let row = this.getRow();
        let activeColumns = [...row.el.children].filter((c) => c.classList.contains('active') && c !== this.el);
        if (activeColumns.length === 0) {
            row.el.dispatchEvent(new Deactivate(row));
        } /*else {
            console.log('Column has active siblings', this.el, activeColumns);
            activeColumns.forEach((c) => c.dispatchEvent(new Deactivate(c)));
        }*/
    }
    /** Returns this row's table-group
        @returns {TR} Table Row
    */
    getRow() {
        return this.getProtoTypeByClass('TR'); // this.node;
    }
}
export { CONTAINER, EL, MODEL, TR }