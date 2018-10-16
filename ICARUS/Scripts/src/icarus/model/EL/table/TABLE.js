/** @module */
import EL from '../EL.js';
import TGROUP from './tgroup/TGROUP.js';
/** A TABLE */
export default class TABLE extends EL {
    constructor(node, model) {
        super(node, 'TABLE', model);
        this.columns = model.columns; // Array<COLUMN> The default columns for this table (schema)
        this.groups = [];
        this.addGroups(model.groups);
    }
    /** Adds the given table group to the table
        @param {string} element Table group element name ie: THEAD, TBODY, TFOOT
    */
    addGroup(element) {
        this.groups.push(new TGROUP(this, new MODEL().set({
            'element': element,
            'rows': []
        })));
        return this.groups[this.groups.length - 1];
    };
    /** Adds groups to the table ['thead', 'tbody', 'tfoot']
        @param {Array<TGROUP>} groups An array of groups
    */
    addGroups(groups) {
        groups.forEach((group) => {
            this.addGroup(group);
        });
    }
}