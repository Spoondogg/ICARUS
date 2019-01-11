/** @module */
import Hideable, { EL } from '../Hideable/Hideable.js';
//import Activate from '../../event/Activate.js';
/** An interface for Open/Close/Destroy driven Events
    @class
    @extends Hideable
*/
export default class Closeable extends Hideable {
	/** A series of Open/Close Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
    constructor(node) {
        super(node, 'closeable');
    }
    addListeners(node) {
        node.el.addEventListener('open', () => node.open());
        node.el.addEventListener('close', () => node.close());
    }
    setMethods(node) {
        /** Open this element
            @returns {Promise<ThisType>} callback
        */
        this.methods.open = () => node.callback(() => node.addClass('open'));
        /** Shows the element
	        @returns {Promise<DIALOG>} Callback on successful display of dialog
	    */
        this.methods.show = () => node.callback(() => $(this.el).modal('show'));
        /** Hides this element
            @param {number} delay Millisecond delay until element is closed
            @param {boolean} preserve If true, element is not deleted
            @returns {Promise<ThisType>} callback
        */
        this.methods.hide = (delay = 200, preserve = true) => new Promise((resolve, reject) => {
            try {
                node.addClass('hiding');
                setTimeout(() => {
                    $(node.el).modal('hide');
                    if (preserve) {
                        resolve(node);
                    } else {
                        node.destroy().then(() => {
                            console.log('Closing "CLOSEABLE" element, resolving caller', node.caller);
                            resolve(node.caller.deactivate());
                        });
                    }
                }, delay);
            } catch (e) {
                reject(e);
            }
        });
        /** Close (Hide and Destroy) this element
            @param {number} delay Millisecond delay until element is closed
            @returns {Promise<ThisType>} callback
        */
        this.methods.close = (delay = 200) => node.hide(delay, false);
    }
}
export { EL };