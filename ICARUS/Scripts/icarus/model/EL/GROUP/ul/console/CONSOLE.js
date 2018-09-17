/**
    @module
*/
import UL from '../UL.js';
import MODEL from '../../../../MODEL.js';
/**
    A console like panel (UL) that contains entries as list items (LI)
    @class
    @extends UL
 */
export default class CONSOLE extends UL {

    /**
        Construct a console
        @param {EL} node Console parent
        @param {MODEL} model Console model
    */
    constructor(node, model) {
        super(node, model);        
    }

    /**
        Adds the given text as a list item to the 
        console (UL) at the top of the list
        @param {string} text Text to be added
        @returns {LI} The console entry
    */
    addEntry(text) {
        let li = this.addListItem(new MODEL().set({
            'label': text
        }));
        $(this.el).prepend(li.el);
        return li;
    }
}