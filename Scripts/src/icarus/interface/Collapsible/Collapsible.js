/** @module */
import INTERFACE from '../INTERFACE.js';
/** An interface for Collapse driven Events
    @class
    @extends INTERFACE
*/
export default class Collapsible extends INTERFACE {
	/** A series of Collapse Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        param {Event} eventOn Event to call if class does not yet exist
        param {Event} eventOff Event to call if class already exists
	*/
    constructor(node) {
        super(node);
        node.addClass('collapse');
        node.el.addEventListener('collapse', () => node.collapse());
        node.el.addEventListener('expand', () => node.expand());
        node.el.addEventListener('toggle', () => node.toggle());
        /** Toggles the collapsed state of the node
	       @returns {Promise<ThisType>} callback
	    */
        this.methods.toggle = () => node.callback(() => $(node.el).collapse('toggle'));
        /** Collapses the node
	        @returns {Promise<ThisType>} callback
	    */
        this.methods.collapse = () => node.callback(() => $(node.el).collapse('hide'));
        /** Expands the node
	        @returns {ThisType} callback
	    */
        this.methods.expand = () => node.callback(() => $(node.el).collapse('show'));
    }
}