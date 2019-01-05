/** @module */
import INTERFACE from '../INTERFACE.js';
/** An interface for Select driven Events
    @class
    @extends INTERFACE
*/
export default class Selectable extends INTERFACE {
	/** A series of Select Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
        param {Event} eventOn Event to call if class does not yet exist
        param {Event} eventOff Event to call if class already exists
	*/
    constructor(node) {
        super(node);
        //node.addClass('selectable');
        this.methods.select = () => node.callback(() => node.deselectAll().then(() => node.addClass('selected')));
        /** Deselect this element
            @returns {Promise<ThisType>} callback
        */
        this.methods.deselect = () => Promise.resolve(node.removeClass('selected'));
        /** Deselects any 'selected' elements 
            @returns {Promise<void>} callback
        */
        this.methods.deselectAll = () => Promise.resolve($('.selected').removeClass('selected'));
    }
}