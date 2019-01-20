/** @module */
import EL, {
	ATTRIBUTES,
	MODEL
} from '../model/el/EL.js';
import AbstractMethodError from '../error/AbstractMethodError.js';
/** A generic interface for an EL element
    @class
*/
export default class IFACE {
	/** Construct a generic Interface 
        @param {EL} node Parent Element
        @param {string} name Interface identifying name
    */
	constructor(node, name) {
		this.node = node;
		node.addClass(name);
		/** A collection of methods available on this interface
		    @property {object} methods
		*/
		this.methods = {};
		/** A collection of events available on this interface
		    @property {object} events
		*/
		this.events = {};
		/** A collection of handlers available on this interface
		    @property {object} handlers
		*/
		this.handlers = {};
		// Configuration and Setup
		this.setMethods(node);
		this.addListeners(node);
	}
	/** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		console.log('node', node);
		throw new AbstractMethodError('IFACE setMethods not set', this);
	}
	/** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
	addListeners(node) {
		console.log('node', node);
		throw new AbstractMethodError('IFACE addListeners not set', this);
	}
	/** Toggles state of this element and triggers the appropriate event
	    @param {string} className Existence of classname indicates on/off event to call
	    @param {Event} eventOn Event to call if class does not yet exist
	    @param {Event} eventOff Event to call if class already exists
	    @returns {ThisType} callback
	*/
	toggle(className, eventOn, eventOff) {
		return this.node.callback(
			() => this.node.el.dispatchEvent(this.node.hasClass(className) ? eventOff : eventOn));
	}
}
export {
	ATTRIBUTES,
	EL,
	MODEL
};