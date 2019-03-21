/** @module */
import EL, { ATTRIBUTES, MODEL } from '../model/el/EL.js';
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
		    @property {Object.<Function>} methods
		*/
		this.methods = {};
		/** A collection of events available on this interface
		    @property {Object.<Event>} events
		*/
		this.events = {};
		/** A collection of handlers available on this interface
		    @property {Object.<Function>} handlers
		*/
		this.handlers = {};
		// Configuration and Setup
		this.setMethods(node);
		/** Configures Event Propagation and Default Behavior
		    @param {Event} ev Event
		    @returns {void}
		*/
		this.methods.configureEvent = this.configureEvent.bind(node);
		this.addListeners(node);
	}
	/** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
	addListeners(node) {
		console.log('node', node);
		throw new AbstractMethodError('IFACE addListeners not set', this);
	}
	/** Configures Event Propagation and Default Behavior
	    @param {Event} ev Event
	    @returns {void}
	*/
	configureEvent(ev) {
		if (this.stopPropagation) {
			ev.stopPropagation();
		}
		if (this.preventDefault) {
			ev.preventDefault();
		}
	}
	/** Wraps the given function in a try/catch, catches TypeErrors and throws unknown Error
	    @param {Function} fn Function to call
	    @param {Event} event Event
	    @param {string} message Error Message to display
	    @returns {void}
	*/
	onError(fn, event, message) {
		try {
			fn(event);
		} catch (e) {
			if (!(e instanceof TypeError)) {
				console.warn(message, e);
				throw e;
			}
		}
	}
	/** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		console.log('node', node);
		throw new AbstractMethodError('IFACE setMethods not set', this);
	}
	/** Toggles state of this element and triggers the appropriate event
	    @param {string} className Existence of classname indicates on/off event to call
	    @param {Event} eventOn Event to call if class does not yet exist
	    @param {Event} eventOff Event to call if class already exists
	    @returns {Promise<ThisType>} Promise Chain
	*/
	toggle(className, eventOn, eventOff) {
		return this.node.chain(
			() => this.node.el.dispatchEvent(this.node.hasClass(className) ? eventOff : eventOn));
	}
}
export { ATTRIBUTES, EL, MODEL }