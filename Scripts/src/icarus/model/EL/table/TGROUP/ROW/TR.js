/** @module */
//import COLUMN, { EL, MODEL } from './column/COLUMN.js';
import CONTAINER, { Clickable, Deactivate, EL, Expand, MODEL } from '../../../container/CONTAINER.js';
//import TD from './column/TD.js';
import TGROUP, { TD, TH } from '../TGROUP.js';
//import TH from './column/TH.js';
/** A Row that exists inside a table */
export default class TR extends CONTAINER {
	/** Constructs a TR element
        @param {EL} node Parent
        @param {MODEL} model The model
        @param {Array<string>} [containerList] An array of strings representing child Containers that this Container can create
    */
    constructor(node, model, containerList = ['TD', 'TH']) { // 
        super(node, 'TR', model, containerList); //
        this.addClass('table-row');
        this.removeAttribute('draggable');
        this.removeClass('draggable');
        this.childLocation = this;
        this.body.destroy();
        this.implement(new Clickable(this));
        //this.navheader.destroy();
        
        this.el.addEventListener('activate', () => {
            console.log(this.toString() + '.activate()');
            /*let tGroup = this.getTGroup();
            if (tGroup.hasClass('active')) {
                let activeRows = [...tGroup.el.children].filter((c) => c.classList.contains('active') && c !== this.el);
                activeRows.forEach((s) => s.dispatchEvent(new Deactivate(s)));
            } else {
                tGroup.el.dispatchEvent(new Activate(tGroup));
            }*/
        });
        this.el.addEventListener('deactivate', () => {
            //this.deactivateChildren();
            /*
            let tGroup = this.getTGroup();
            let activeRows = [...tGroup.el.children].filter((c) => c.classList.contains('active') && c !== this.el);
            if (activeRows.length === 0) {
                tGroup.el.dispatchEvent(new Deactivate(tGroup));
            } else {
                console.log('Row has active siblings', this.el, activeRows);
            }
            */
        });
    }    
    constructElements() {
        return this.chain(() => {
            if (this.dataId > 0) {
                this.createEditableElement('p', this.childLocation);
            } else {
                console.log('No data exists for ' + this.toString());
                this.navheader.el.dispatchEvent(new Expand(this.navheader));
            }
            /*
            if (this.columns) {
                this.addColumns(this.columns);
            } else if (this.dataId > 0) {
                    this.addColumns(this.data.columns);
            } else {
                //console.log('Adding default columns', this);
                let cols = this.getTGroup().getTable().data.columns.split(',');
                let colStr = cols.map(() => 'null').join(',');
                this.addColumns(colStr);
            }*/
        });
    }
    getColType() {
        return this.getTGroup().className === 'TBODY' ? 'TD' : 'TH';
    }
    getActiveColumns() {
        return this.get(null, this.getColType()).filter((c) => c.hasClass('active') && c !== this);
    }
    /*addColumn(model, tGroup = this.getTGroup()) {

        //let tGroup = this.getTGroup(); // can this be cached or passed through?
        if (tGroup.className === 'TBODY') {
            this.addTd(model);
        } else {
            this.addTh(model);
        }
    }*/
    /** Adds the given column set to this row with the appropriate element type
        @param {string} columns A comma delimited string of column values
        @returns {void}
    */
    addColumns(columns) {
        console.log('CREATE COLUMNS', columns);
        let cols = columns.split(',');
        switch (this.getColType()) {
            case 'TD':
                cols.forEach((col) => this.addTd(new MODEL()).setInnerHTML(col));
                break;
            case 'TH':
                cols.forEach((col) => this.addTh(new MODEL()).setInnerHTML(col));
                break;
            default:
                cols.forEach((col) => this.addTd(new MODEL()).setInnerHTML(col));
        }
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
    /** Returns this row's table-group
        @returns {TGROUP} Table Group
    */
    getTGroup() {
        return this.node.node;
    }
    /** Deactivate row siblings
        @returns {void}
    */
    deactivateSiblings() {
        let tGroup = this.getTGroup();
        let siblings = [...tGroup.el.children].filter((c) => c.classList.contains('active') && c !== this.el);
        siblings.forEach((s) => s.dispatchEvent(new Deactivate(s)));
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