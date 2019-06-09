/** @module */
import CONTAINERFACTORY, { ATTRIBUTES, CONTAINER, DIALOGMODEL, EL, FACTORY, MODEL } from '../container/CONTAINERFACTORY.js'; // Deactivate // PAYLOAD, PROMPT, SPAN
import TABLE, { TBODY, TD, TFOOT, TH, THEAD, TR } from '../table/TABLE.js';
/** Constructs various Table Elements and returns them to be appended
    Each Table Element child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
*/
export default class TABLEFACTORY extends CONTAINERFACTORY {
    /** Constructs a FACTORY to build TABLE related CONTAINER Classes */
    constructor() {
        super('TABLE');
    }
    /** Constructs the appropriate element
        @param {string} className Container Constructor Name
        @param {SPAN} span Element Placeholder
        @param {MODEL} model Element MODEL
        @returns {CONTAINER} Newly constructed CONTAINER Class
    */
    build(className, span, model) {
        /** @type {CONTAINER} */
        let element = null;
        switch (className) {
            case 'THEAD':
                element = new THEAD(span, model);
                break;
            case 'TBODY':
                element = new TBODY(span, model);
                break;
            case 'TFOOT':
                element = new TFOOT(span, model);
                break;
            case 'TR':
                element = new TR(span, model);
                break;
            case 'TH':
                element = new TH(span, model);
                break;
            case 'TD':
                element = new TD(span, model);
                break;
            //case 'SPAN':
            //    element = new SPAN(span, model);
            //    break;
            default:
                throw Error('No constructor exists for CONTAINER{' + className + '}');
        }
        return element;
    }
}
export { ATTRIBUTES, CONTAINER, DIALOGMODEL, EL, FACTORY, MODEL, TABLE }