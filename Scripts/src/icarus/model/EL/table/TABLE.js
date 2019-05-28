/** @module */
import CONTAINER, { Activate, Deactivate, Expand, MODEL, Switchable } from '../container/CONTAINER.js';
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
        super(node, 'DIV', model, ['THEAD', 'TBODY', 'TFOOT']);
        this.addClass('table');
        this.body.implement(new Switchable(this.body));
        this.deactivateSiblingsOnActivate = false;
        this.el.addEventListener('activate', () => {
            this.body.el.dispatchEvent(new Activate(this.body));
        });
        this.el.addEventListener('deactivate', () => {
            this.body.el.dispatchEvent(new Deactivate(this.body));
        });
    }
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('header', this);
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
        return this.addChild(new THEAD(this.childLocation, model));
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
        return this.addChild(new TFOOT(this.childLocation, model));
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