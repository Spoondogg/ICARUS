/** @module */
import TGROUP, { MODEL, TD, TH, TR } from './TGROUP.js';
/** A TABLE Footer Group */
export default class TFOOT extends TGROUP {
    /** TFOOT Constructor
        @param {CONTAINER} node Node
        @param {ContainerModel} [model] Model
    */
    constructor(node, model) {
        super(node, 'TFOOT', model);
        this.addClass('table-footer');
    }
}
export { MODEL, TD, TH, TR }