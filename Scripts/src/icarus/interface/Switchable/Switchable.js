/** @module */
import IFACE from '../IFACE.js';
//import Activate from '../../event/Activate.js';
/** An interface for Toggle driven Events for a collapsable element
    @class
    @extends INTERFACE
*/
export default class Switchable extends IFACE {
	/** A series of Switch Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        param {Event} eventOn Event to call if class does not yet exist
        param {Event} eventOff Event to call if class already exists
	*/
    constructor(node) {
        super(node);
        node.addClass('switch');
        /** Toggles the active state of the node
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.flip = () => node.callback(() => $(node.el).toggle('active'));
        /** Adds active state to node
	        @returns {Promise<ThisType>} callback
	    */
        this.methods.activate = () => node.callback(() => node.addClass('active'));
        /** Removes active state from node
	        @returns {ThisType} callback
	    */
        this.methods.deactivate = () => node.callback(() => node.removeClass('active'));
    }
}