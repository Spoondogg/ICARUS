/** @module */
import CONTAINERFACTORY, { ATTRIBUTES, CONTAINER, EL, FACTORY, MODEL, PAYLOAD, PROMPT } from '../../container/CONTAINERFACTORY.js';
import CHAT from './CHAT.js';
import DICTIONARY from '../dictionary/DICTIONARY.js';
import FORM from '../../form/FORM.js';
import WORD from '../word/WORD.js';
/** Constructs various Chat Elements and returns them to be appended
    Each Form Element child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
*/
export default class CHATFACTORY extends CONTAINERFACTORY {
    /** Constructs a FACTORY to build CONTAINER Classes */
    constructor() {
        super('CHAT');
    }
    /** Switch statement to determine appropriate element for this factory to construct
        @param {string} className Container Constructor Name
        @param {SPAN} span Element Placeholder
        @param {ContainerModel} model Model
        @returns {CONTAINER} Newly constructed CONTAINER Class
    */
    build(className, span, model) {
        /** @type {CONTAINER} */
        let element = null;
        switch (className) {
            case 'CHAT':
                element = new CHAT(span, model);
                break;
            case 'DICTIONARY':
                element = new DICTIONARY(span, model);
                break;
            case 'WORD':
                element = new WORD(span, model);
                break;
            default:
                throw Error('No constructor exists for CONTAINER{' + className + '}');
        }
        return element;
    }
}
export { ATTRIBUTES, CONTAINER, EL, FACTORY, FORM, MODEL, PAYLOAD, PROMPT }