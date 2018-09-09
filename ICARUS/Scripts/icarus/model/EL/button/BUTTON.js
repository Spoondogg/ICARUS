import EL from '../EL.js';
import GLYPHICON from '../span/GLYPHICON.js';
import MODEL from '../../MODEL.js';
import ATTRIBUTES from '../../ATTRIBUTES.js';
/**
    A generic Bootstrap button    
*/
export default class BUTTON extends EL {
    /**
        @param {EL} node The parent object
        @param {string} label The label
        @param {string} glyphicon The glyphicon (optional)
        @param {string} buttonType The type of button ie: [button, reset, submit]
     */
    constructor(node, label, glyphicon, buttonType) {
        super(node, 'BUTTON', new MODEL(new ATTRIBUTES({
            'class': 'btn glyphicon',
            'type': buttonType ? buttonType : 'button'
        })));
        this.icon = new GLYPHICON(this, label, glyphicon);
    }
    /**
        Sets the label within the button to the given string
        @param {string} label A button label
        @param {string} glyphicon Glyphicon string or ICON.ENUM
     */
    setLabel(label, glyphicon) {
        console.log('setLabel(' + label + ')');
        this.icon.setIcon(glyphicon);
        this.icon.label.setInnerHTML(label);
    }
}