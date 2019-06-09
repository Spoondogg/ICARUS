/** @module */
import TGROUP, { MODEL, TD, TH, TR } from './TGROUP.js';
/** A TABLE Footer Group */
export default class TFOOT extends TGROUP {
    constructor(node, model) {
        //model.body = { // set collapsible body tag to table
        //    element: 'TFOOT'
        //};
        super(node, 'TFOOT', model);
        this.addClass('table-footer');
    }
}
export { MODEL, TD, TH, TR }