/** @module */
import CONTAINERFACTORY, { ATTRIBUTES, CONTAINER, EL, FACTORY, MODEL, PAYLOAD, PROMPT } from '../../container/CONTAINERFACTORY.js';
import CONTAINERINDEX from './classindex/containerindex/CONTAINERINDEX.js';
import FORMPOSTINDEX from './classindex/formpostindex/FORMPOSTINDEX.js';
import IMAGEINDEX from './classindex/formpostindex/imageindex/IMAGEINDEX.js';
/** Constructs various Index Elements and returns them to be appended
    @description Each Element must be imported individually to avoid cyclic redundancy
    @class
*/
export default class INDEXFACTORY extends CONTAINERFACTORY {
    /** Constructs a FACTORY to build INDEX related CONTAINER Classes */
    constructor() {
        super('INDEX');
    }
    /** Constructs the appropriate element
        @param {string} className Container Constructor Name
        @param {SPAN} span Placeholder
        @param {ContainerModel} [model] Model
        @returns {CONTAINER} Container
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
            /*case 'FORM':
                element = new FORM(span, model);
                break;*/
            default:
                throw Error('No constructor exists for CONTAINER{' + className + '}');
        }
        return element;
    }
}
export { ATTRIBUTES, CONTAINER, EL, FACTORY, MODEL, PAYLOAD, PROMPT }