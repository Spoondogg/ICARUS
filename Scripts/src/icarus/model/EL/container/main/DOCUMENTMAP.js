/** @module */
import REFERENCE from '../REFERENCE.js';
/** A DOCUMENTMAP acts as a top level REFERENCE that
    is made up of many nested REFERENCE(s)
    @class
*/
export default class DOCUMENTMAP extends REFERENCE {
    constructor(node, model) {
        super(node, model);
        this.addClass('document-map');
    }
}