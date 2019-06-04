/** @module */
import CONTAINER, { Expand, MODEL } from '../container/CONTAINER.js';
import TGROUP, { TD, TH, TR } from './tgroup/TGROUP.js';
import TBODY from './TGROUP/TBODY.js';
import TFOOT from './TGROUP/TFOOT.js';
import THEAD from './TGROUP/THEAD.js';
/** A TABLE */
export default class TABLE extends CONTAINER {
    /** @constructs CONTAINER
	    @param {EL} node Parent Node
	    @param {MODEL} model Model
	    @param {Array<string>} containerList An array of strings representing child Containers that this Container can create
	*/
    constructor(node, model) {
        model.body = { // set collapsible body tag to table
            element: 'TABLE'
        };
        super(node, 'DIV', model, ['TR']);
        this.addClass('table');
        this.deactivateSiblingsOnActivate = false;

        this.tHead = new THEAD(this.body.pane, new MODEL());
        this.tHead.addTr(new MODEL());
        //tHeadRow.addColumn(new MODEL().set('innerHTML', 'thead'));

        this.tBody = new TBODY(this.body.pane, new MODEL());
        this.childLocation = this.tBody;

        this.tFoot = new TFOOT(this.body.pane, new MODEL());
        this.tFoot.addTr(new MODEL());
        //tFootRow.addColumn(new MODEL().set('innerHTML', 'tfoot'));
    }
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('header', this);
                console.log(this.toString() + '.columns', this.data);
                if (this.data.columns) {
                    // create columns in THEAD and TFOOT
                    let cols = this.data.columns.split(',');
                    console.log(this.toString() + '.cols', cols);
                    //let tHeadRow = new TR(this.tHead, new MODEL().set('columns', this.data.columns), ['TH']);
                    //let tFootRow = new TR(this.tFoot, new MODEL().set('columns', this.data.columns), ['TH']);

                    let [tHeadRow] = this.tHead.get(null, 'TR');
                    cols.forEach((col) => tHeadRow.addColumn(new MODEL().set('innerHTML', col)));
                    let [tFootRow] = this.tFoot.get(null, 'TR');
                    cols.forEach((col) => tFootRow.addColumn(new MODEL().set('innerHTML', col)));

                    //this.tFoot.addTr(colModel);
                    /*cols.forEach((col) => {
                        tHeadRow.addTh(new MODEL().set('innerHTML', col));
                        tFootRow.addTh(new MODEL().set('innerHTML', col));
                    });*/
                    /*
                    if (tGroup.className === 'TBODY') {
                        cols.forEach((col) => this.addTd(new MODEL()).setInnerHTML(col));
                    } else {
                        cols.forEach((col) => this.addTh(new MODEL()).setInnerHTML(col));
                    }
                    */
                }

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
	addTHead(model) {
        let tHead = this.addChild(new THEAD(this.childLocation, model));
        $(tHead.el).insertBefore(this.body.pane);
        return tHead;
    }
    /** Adds the given table group to the table
	    @param {MODEL} model Object model
	    @returns {TGROUP} A Table group
	*/
    addTBody(model) {
        return this.addChild(new TBODY(this.childLocation, model));
    }
    /** Adds the given table group to the table
	    @param {MODEL} model Object model
	    @returns {TGROUP} A Table group
	*/
    addTFoot(model) {
        let tFoot = this.addChild(new TFOOT(this.childLocation, model));
        $(tFoot.el).insertAfter(this.body.pane);
        return tFoot;
    }
    /** Adds a row to the table body group
        @param {MODEL} model Object model
        @returns {TR} A table row
    */
    addRow(model) {
        return this.getTBody().addTr(model);
    }

    /** Returns THEAD (If exists)
        @returns {THEAD} An array of FIELDSET(s)
    */
    getTHead() {
        let [results] = this.get(null, 'THEAD');
        return results;
    }
    /** Returns TBODY (If exists)
        @returns {TBODY} An array of FIELDSET(s)
    */
    getTBody() {
        let [results] = this.get(null, 'TBODY');
        return results;
    }
    /** Returns TFOOT (If exists)
        @returns {TFOOT} An array of FIELDSET(s)
    */
    getTFoot() {
        let [results] = this.get(null, 'TFOOT');
        return results;
    }
    static createEmptyTable(node) {
        console.log('TABLE.createEmptyTable()');
        return new Promise((resolve, reject) => {
            try {
                let table = new TABLE(node, new MODEL().set({
                    showNav: 0,
                    body: {
                        element: 'TABLE'
                    }
                }));
                table.addEach(['THEAD', 'TBODY', 'TFOOT']);
                resolve(table);
            } catch (e) {
                reject(e);
            }
        });
    }
}
export { MODEL, TBODY, TD, TGROUP, TH, THEAD, TFOOT, TR }