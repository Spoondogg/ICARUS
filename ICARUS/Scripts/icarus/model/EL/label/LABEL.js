import EL, { MODEL } from '../EL.js';
import ATTRIBUTES from '../../ATTRIBUTES.js';
/**
    A standard control-label for form elements
*/
export default class LABEL extends EL {
    /**
        Constructs a generic Label
        @param {EL} node the parent
        @param {string} label The innerHtml to be displayed
     */
    constructor(node, label) {
        super(node, 'LABEL', new MODEL(new ATTRIBUTES('control-label')), label || 'My Label');
    }

    /**
        Sets the value of this label
        @param {string} name New name to apply
     */
    rename(name) {
        this.setInnerHTML(name);
    }
}