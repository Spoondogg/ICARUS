/** @module */
import IFACE from '../IFACE.js';
//import Activate from '../../event/Activate.js';
/** An interface for Click driven Events
    @class
    @extends INTERFACE
*/
export default class Clickable extends IFACE {
	/** A series of Click Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        param {Event} eventOn Event to call if class does not yet exist
        param {Event} eventOff Event to call if class already exists
	*/
    constructor(node) {
        super(node);
        node.addClass('clickable');
        this.methods.click = () => console.log('Clickable Interface', this, node);
    }
}