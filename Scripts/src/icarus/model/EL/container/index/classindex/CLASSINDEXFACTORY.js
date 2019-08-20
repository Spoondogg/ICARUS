/** @module */
import CONTAINERFACTORY, { ATTRIBUTES, CONTAINER, EL, FACTORY, MODEL, PAYLOAD, PROMPT } from '../../../container/CONTAINERFACTORY.js';
import CONTAINERINDEX from '../classindex/containerindex/CONTAINERINDEX.js';
import FORMPOSTINDEX from '../classindex/formpostindex/FORMPOSTINDEX.js';
import IMAGEINDEX from '../classindex/formpostindex/imageindex/IMAGEINDEX.js';
/** Constructs various ClassIndex Elements and returns them to be appended
    Each Index Element child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
*/
export default class CLASSINDEXFACTORY extends CONTAINERFACTORY {
    /** Constructs a FACTORY to build INDEX related CONTAINER Classes */
    constructor() {
        super('CLASSINDEX');
    }
    /** Constructs the appropriate element
        @param {string} className Container Constructor Name
        @param {SPAN} span Element Placeholder
        @param {ClassIndexModel} model Model
        @returns {CONTAINER} Newly constructed CLASSINDEX Container Class
    */
    build(className, span, model) {
        /** @type {CONTAINER} */
        let element = null;
        switch (className) {
            case 'FORMPOSTINDEX':
                element = new FORMPOSTINDEX(span, model);
                break;
            case 'CONTAINERINDEX':
                element = new CONTAINERINDEX(span, model);
                break;
            case 'IMAGEINDEX':
                element = new IMAGEINDEX(span, model);
                break;
            default:
                throw Error('No constructor exists for CONTAINER{' + className + '}');
        }
        return element;
    }
}
export { ATTRIBUTES, CONTAINER, CONTAINERINDEX, EL, FACTORY, MODEL, PAYLOAD, PROMPT }