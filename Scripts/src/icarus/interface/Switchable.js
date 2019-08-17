/** @module */
import IFACE, { ATTRIBUTES, AbstractMethodError, EL, MODEL, MissingContainerError, RecursionLimitError } from './IFACE.js';
import Activate from '../event/Activate.js';
import Deactivate from '../event/Deactivate.js';
/** An interface for Toggle driven Events for a collapsable element
    @class
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
        this.methods.activate = () => node.chain(() => {
            if (!node.hasClass('active')) {
                node.addClass('active');
            }
        });
		/** Removes active state from node
	        @returns {Promise<ThisType>} Promise Chain
	    */
        this.methods.deactivate = () => {
            if (node.hasClass('active')) {
                node.chain(() => {
                    node.get()
                        .filter((c) => c.hasClass('active'))
                        .forEach((c) => c.el.dispatchEvent(new Deactivate(c)));
                    node.removeClass('active');
                    try {
                        node.deactivateReference();
                    } catch (e) {
                        if (!(e instanceof TypeError)) {
                            console.error(this.toString() + '.deactivateReference()', e);
                        }
                    }
                });
            }
        }
		/** 'Flipping' this switch toggles the 'active' state of this element, triggering an Activate/Deactivate Event
		    @param {string} className Existence of classname indicates on/off event to call
		    @param {Event} eventOn Event to call if class does not yet exist
		    @param {Event} eventOff Event to call if class already exists
		    @returns {Promise<ThisType>} Promise Chain
		*/
		this.methods.flip = () => this.toggle('active', new Activate(node), new Deactivate(node));
	}
}
export { AbstractMethodError, Activate, ATTRIBUTES, Deactivate, EL, IFACE, MODEL, MissingContainerError, RecursionLimitError }