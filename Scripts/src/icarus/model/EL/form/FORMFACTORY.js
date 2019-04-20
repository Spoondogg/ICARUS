/** @module */
import CONTAINERFACTORY, { ATTRIBUTES, CONTAINER, DIALOGMODEL, EL, FACTORY, MODEL, PAYLOAD, PROMPT, SPAN } from '../container/CONTAINERFACTORY.js'; // Deactivate
import FORMSELECT, { OPTION } from '../../container/formelement/formselect/FORMSELECT.js';
import FIELDSET from '../../fieldset/FIELDSET.js';
import FORM from '../../form/FORM.js';
//import FORMELEMENT from '../../container/formelement/FORMELEMENT.js';
import FORMELEMENTGROUP from '../../container/formelement/FORMELEMENTGROUP.js';
import FORMINPUT from '../../container/formelement/forminput/FORMINPUT.js';
import FORMPOSTINPUT from '../../container/formelement/formpostinput/FORMPOSTINPUT.js';
import FORMTEXTAREA from '../../container/formelement/formtextarea/FORMTEXTAREA.js';
/** Constructs various Form Elements and returns them to be appended
    Each Form Element child must be imported individually
    to avoid cyclic redundancy of dependencies
    @class
*/
export default class FORMFACTORY extends CONTAINERFACTORY {
    /* eslint-disable max-lines-per-function, complexity, max-statements */
    /** Constructs a FACTORY to build FORM related CONTAINER Classes */
    constructor() {
        super('FORM');
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
            case 'FIELDSET':
                element = new FIELDSET(span, model);
                break;
            case 'FORMELEMENT':
                element = this.processFormElement(span, model);
                break;
            case 'FORMELEMENTGROUP':
                element = new FORMELEMENTGROUP(span, model);
                break;
            case 'FORMINPUT':
                element = new FORMINPUT(span, model);
                break;
            case 'FORMSELECT':
                element = new FORMSELECT(span, model);
                break;
            case 'FORMTEXTAREA':
                element = new FORMTEXTAREA(span, model);
                break;
            case 'OPTION':
                element = new OPTION(span, model);
                break;
            case 'SPAN':
                element = new SPAN(span, model);
                break;
            default:
                throw Error('No constructor exists for CONTAINER{' + className + '}');
        }
        return element;
    }
    /** Create appropriate FORM ELEMENT based on payload.model
        @param {SPAN} span Container Temporary Holder
        @param {MODEL} model Json Payload.model
        @returns {FORMELEMENT} Form Element
    */
    processFormElement(span, model) {
        let element = null;
        if (model.type === 'FORMPOSTINPUT') {
            element = new FORMPOSTINPUT(span, model);
        } else {
            switch (model.element) {
                case 'TEXTAREA':
                    element = new FORMTEXTAREA(span, model);
                    break;
                case 'SELECT':
                    element = new FORMSELECT(span, model);
                    break;
                case 'INPUT':
                    element = new FORMINPUT(span, model);
                    break;
                case 'OPTION':
                    element = new OPTION(span, model);
                    break;
                default:
                    element = new FORMINPUT(span, model);
                    break;
            }
        }
        return element;
    }
}
export { ATTRIBUTES, CONTAINER, DIALOGMODEL, EL, FACTORY, FORM, MODEL, PAYLOAD, PROMPT }
/* eslint-enable */