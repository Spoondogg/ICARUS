/** @module */
import TGROUP, { MODEL, TD, TH, TR } from './TGROUP.js';
/** A TABLE Header Group */
export default class THEAD extends TGROUP {
    /** TBODY Constructor
        @param {CONTAINER} node Node
        @param {ContainerModel} model Model
    */
    constructor(node, model) {
        super(node, 'THEAD', model);		
        this.addClass('table-header');
    }
}
export { MODEL, TD, TH, TR }