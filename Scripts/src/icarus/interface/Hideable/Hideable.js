/** @module */
import IFACE from '../IFACE.js';
//import Activate from '../../event/Activate.js';
/** An interface for Display driven Events
    @class
    @extends INTERFACE
*/
export default class Hideable extends IFACE {
	/** A series of Display Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        param {Event} eventOn Event to call if class does not yet exist
        param {Event} eventOff Event to call if class already exists
	*/
    constructor(node) {
        super(node);
        node.addClass('hideable');
        /** Promises to collapse the MENU
	        @returns {Promise<ThisType>} callback
	    */
        this.methods.hide = () => node.callback(() => {
            node.el.style.display = 'none';
        });
        /** Expands the MENU body
            @returns {Promise<ThisType>} callback
        */
        this.methods.show = () => node.callback(() => {
            node.el.style.display = 'block';
        });
    }
}