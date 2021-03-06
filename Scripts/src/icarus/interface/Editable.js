/** @module */
import IFACE, {	EL } from '../IFACE.js';
/** An interface for Modification/Edit driven Events
    @class
    @extends IFACE
*/
export default class Editable extends IFACE {
	/** A series of Edit Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'editable');
	}
	addListeners(node) {
		node.el.addEventListener('edit', () => node.edit());
		node.el.addEventListener('open', () => node.edit());
		node.el.addEventListener('closed', () => node.edit());
	}
	/** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		/** Edit the element
	        @returns {Promise<ThisType>} Promise Chain
	    */
		this.methods.edit = () => node.chain(() => console.log('Edit', node));
	}
	/** Opens the ELEMENT up for editing.  This should create a link
	    between the object on the server and its client side representation
	    @returns {EL} This EL
	
    open() {
        return this.chain(() => {
            this.status = STATUS.OPEN;
            //this.el.setAttribute('data-status', 'open');
            try {
                this.node.open();
            } catch (e) {
                console.warn('Unable to open parent element(' + this.element + ')', e);
            }
        });
	}*/
	/** Closes the EL up for editing.  <br>This should create a link
	    between the object on the server and its client side representation
	    and update accordingly
	    @returns {EL} This EL
	
    close() {
        return this.chain(() => {
            this.status = STATUS.CLOSED;
        });
	}*/
}
export { EL, IFACE }