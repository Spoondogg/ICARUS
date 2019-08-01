/** @module */
import TGROUP, { MODEL, TD, TH, TR } from './TGROUP.js';
/** A TABLE Body Grouping */
export default class TBODY extends TGROUP {
    /** TBODY Constructor
        @param {CONTAINER} node Node
        @param {ContainerModel} model Model
    */
    constructor(node, model) {
        super(node, 'TBODY', model);
        this.addClass('table-body');
    }
}
export { MODEL, TD, TH, TR }