/** @module */
//import COLUMN, { EL, MODEL } from './column/COLUMN.js';
import CONTAINER, { Clickable, Deactivate, EL, Expand, MODEL } from '../../../container/CONTAINER.js';
//import TD from './column/TD.js';
import TGROUP, { TD, TH } from '../TGROUP.js';
//import TH from './column/TH.js';
/** A Row that exists inside a table */
export default class TR extends CONTAINER {
	/** Constructs a TR element
        @param {EL} node Node
        @param {MODEL} [model] Model
        @param {Array<string>} [containerList] An array of strings representing child Containers that this Container can create
    */
    constructor(node, model, containerList = node.getContainer().className === 'TBODY' ? ['TD'] : ['TH']) { // 
        super(node, 'TR', model, containerList); //
        this.addClass('table-row');
        this.removeAttribute('draggable');
        this.removeClass('draggable');
        this.childLocation = this;        
        this.navheader.destroy();
        this.body.destroy();
        this.implement(new Clickable(this));
        this.el.addEventListener('activate', () => this.activateEvent());
        this.el.addEventListener('deactivate', () => console.log('Deactivated TR'));
    }    
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('p', this.childLocation);
            } else {
                //console.log('No data exists for ' + this.toString());
                this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
        });
    }
    activateEvent() {
        let cols = this.getColumns();
        console.log('Activated TR', this.getTGroup(), cols);
    }
    /** Retrieves an array of columns inside this row
        @returns {Array<COLUMN>} An array of Columns
    */
    getColumns() {
        return this.get(null, this.getColType());
    }
    /** Determines the appropriate COLUMN Element based on its parent class
        @returns {string} Column Element Tag Name
    */
    getColType() {
        return this.getTGroup().className === 'TBODY' ? 'TD' : 'TH';
    }
    // consider a way of injecting filters directly into a this.get() call ie: this.get(null, 'TD', hasClass(c, 'active'));
    // pass a function that returns true (filter)
    // 
    getActiveColumns() { 
        return this.getColumns().filter((c) => c.hasClass('active') && c !== this);
    }
    addColumn(model) {
        let col = null;
        switch (this.getColType()) {
            case 'TD':
                col = this.addTd(model);
                break;
            case 'TH':
                col = this.addTh(model);
                break;
            default:
                col = this.addTd(model);
        }
        return col;
    }
    /** Returns this row's table-group (THEAD|TBODY|TFOOT)
        @returns {TGROUP} Table Group
    */
    getTGroup() {
        return this.getContainer();
    }
    /** Deactivate row siblings
        @returns {void}
    */
    deactivateSiblings() {
        let siblings = [...this.getTGroup().el.children].filter((c) => c.classList.contains('active') && c !== this.el);
        siblings.forEach((s) => s.dispatchEvent(new Deactivate(s)));
    }
	/** Adds the given table data to the table
	    @param {ContainerModel} model Mmodel
	    @returns {TD} A Table group
	*/
    addTd(model) {
        return this.addChild(new TD(this.childLocation, model));
    }
    /** Adds the given table header data to the table
	    @param {ContainerModel} model Model
	    @returns {TH} A Table group
	*/
    addTh(model) {
        return this.addChild(new TH(this.childLocation, model));
    }
}
export { EL, MODEL, TD, TGROUP, TH }