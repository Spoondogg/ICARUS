/** @module */
import IFACE, { ATTRIBUTES, EL, MODEL } from './IFACE.js';
import Activate from '../event/Activate.js';
import Deactivate from '../event/Deactivate.js';
/** An interface for Toggle driven Events for a collapsable element
    @class
    @extends IFACE
*/
export default class Switchable extends IFACE {
	/** A series of Switch Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'switch');
    }
    /** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
	addListeners(node) {
		node.el.addEventListener('activate', () => node.activate());
		node.el.addEventListener('deactivate', () => node.deactivate());
		node.el.addEventListener('flip', () => node.flip());
    }
    /** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		/** Adds active state to node
	        @returns {Promise<ThisType>} Promise Chain
	    */
        this.methods.activate = () => node.chain(() => node.addClass('active'));
		/** Removes active state from node
	        @returns {Promise<ThisType>} Promise Chain
	    */
        this.methods.deactivate = () => node.chain(() => node.removeClass('active'));
		/** Toggles the 'active' state of this element, triggering an Activate/Deactivate Event
		    @param {string} className Existence of classname indicates on/off event to call
		    @param {Event} eventOn Event to call if class does not yet exist
		    @param {Event} eventOff Event to call if class already exists
		    @returns {Promise<ThisType>} Promise Chain
		*/
		this.methods.flip = () => this.toggle('active', new Activate(node), new Deactivate(node));
	}
}
export { Activate, ATTRIBUTES, Deactivate, EL, MODEL }