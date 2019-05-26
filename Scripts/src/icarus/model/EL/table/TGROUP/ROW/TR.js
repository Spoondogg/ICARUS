/** @module */
//import COLUMN, { EL, MODEL } from './column/COLUMN.js';
import CONTAINER, { Activate, Deactivate, EL, Expand, MODEL } from '../../../container/CONTAINER.js';
//import TD from './column/TD.js';
import TGROUP, { TD, TH } from '../TGROUP.js';
//import TH from './column/TH.js';
/** A Row that exists inside a table */
export default class TR extends CONTAINER {
	/** Constructs a TR element
        @param {EL} node Parent
        @param {MODEL} model The model
    */
    constructor(node, model) {
        //model.body = { // set collapsible body tag to table
        //    element: 'TR'
        //};
        super(node, 'TR', model, ['TD', 'TH']);
        this.addClass('table-row');
        this.removeAttribute('draggable');
        this.removeClass('draggable');
        //this.deactivateSiblingsOnActivate = true;
        this.childLocation = this;
        this.navheader.destroy();
        this.body.destroy();
        this.el.addEventListener('activate', () => this.activateTGroup());
        this.el.addEventListener('deactivate', () => this.deactivateTGroup());
    }
    activateTGroup() {
        let tGroup = this.getTGroup();

        //let siblings = tGroup.get().filter((c) => c !== this);
        //siblings.forEach((s) => s.el.dispatchEvent(new Deactivate(s)));  
        //tGroup.get().filter(
        //    (c) => c !== this).forEach(
        //    (cc) => cc.el.dispatchEvent(new Deactivate(this)));

        tGroup.el.dispatchEvent(new Activate(tGroup));

            //console.log('Deactivating Siblings', tGroup.get());
    }
    deactivateTGroup() {
        let tGroup = this.getTGroup();
        //let siblings = tGroup.get().filter((c) => c !== this);
        //console.log(this.toString() + '.siblings', siblings);
        //siblings.forEach((s) => s.el.dispatchEvent(new Deactivate(s)));
        //this.get().forEach((c) => {
        //    console.log('Deactivate Me', c.el.innerHTML);
        //    c.el.dispatchEvent(new Deactivate(c));
        //});

        //console.log('Deactivating TGROUP', tGroup);
        tGroup.el.dispatchEvent(new Deactivate(tGroup));
    }
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                if (this.data.columnIds) {
                    // CREATE COLUMNS
                    console.log('CREATE COLUMNS', this.data.columnIds);
                    let tGroup = this.getTGroup();
                    let cols = this.data.columnIds.split(',');
                    if (tGroup.className === 'TBODY') {
                        cols.forEach((col) => this.addTd(new MODEL()).setInnerHTML(col));
                    } else {
                        cols.forEach((col) => this.addTh(new MODEL()).setInnerHTML(col));
                    }
                }
            } else {
                console.log('No data exists for ' + this.toString());
                this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
        });
    }
    /** Returns this row's table-group
        @returns {TGROUP} Table Group
    */
    getTGroup() {
        return this.node.node;
    }
	/** Adds the given table data to the table
	    @param {MODEL} model Object model
	    @returns {TD} A Table group
	*/
    addTd(model) {
        return this.addChild(new TD(this.childLocation, model));
    }
    /** Adds the given table header data to the table
	    @param {MODEL} model Object model
	    @returns {TH} A Table group
	*/
    addTh(model) {
        return this.addChild(new TH(this.childLocation, model));
    }
}
export { EL, MODEL, TD, TGROUP, TH }