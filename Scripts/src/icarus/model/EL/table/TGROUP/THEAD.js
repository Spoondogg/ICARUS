/** @module */
import TGROUP, { MODEL, TD, TH, TR } from './TGROUP.js';
/** A TABLE Header Group */
export default class THEAD extends TGROUP {
    constructor(node, model) {
        //model.body = { // set collapsible body tag to table
        //    element: 'THEAD'
        //};
        super(node, 'THEAD', model);		
        this.addClass('table-header');
    }
}
export { MODEL, TD, TH, TR }