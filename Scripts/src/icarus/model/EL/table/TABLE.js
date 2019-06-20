/** @module */
import CONTAINER, { MODEL } from '../container/CONTAINER.js';
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
        this.deactivateSiblingsOnActivate = false;
        this.childLocation = this.body;
        this.body.pane.destroy();
    }
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('header', this);
            } /*else {
                //console.log('No data exists for ' + this.toString());
                //this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }*/
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
}
export { MODEL, TBODY, TD, TGROUP, TH, THEAD, TFOOT, TR }