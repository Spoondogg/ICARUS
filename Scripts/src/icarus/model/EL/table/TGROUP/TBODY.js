/** @module */
import TGROUP, { MODEL, TD, TH, TR } from './TGROUP.js';
/** A TABLE Body Grouping */
export default class TBODY extends TGROUP {
    constructor(node, model) {
        //model.body = { // set collapsible body tag to table
        //    element: 'TBODY'
        //};
        super(node, 'TBODY', model);
        this.addClass('table-body');
    }
}
export { MODEL, TD, TH, TR }