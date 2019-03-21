/** @module */
import Hideable, { EL, IFACE } from './Hideable.js';
/** An interface for Open/Close/Destroy driven Events
    @class
    @extends Hideable
*/
export default class Closeable extends Hideable {
	/** A series of Open/Close Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'closeable');
	}
	addListeners(node) {
		node.el.addEventListener('open', () => node.open());
		node.el.addEventListener('close', () => node.close());
	}
	/** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		/** Open this element
		    @returns {Promise<ThisType>} Promise Chain
		*/
		this.methods.open = () => node.chain(() => node.addClass('open'));
		/** Shows the element
	        @returns {Promise<DIALOG>} Callback on successful display of dialog
	    */
		this.methods.show = () => node.chain(() => $(this.el).modal('show'));
		/** Hides this element
		    @param {number} delay Millisecond delay until element is closed
		    @param {boolean} preserve If true, element is not deleted
		    @returns {Promise<ThisType>} Promise Chain
		*/
		this.methods.hide = (delay = 200, preserve = true) => new Promise((resolve, reject) => {
			try {
				node.addClass('hiding');
				setTimeout(() => {
					$(node.el).modal('hide');
					if (preserve) {
						resolve(node);
					} else {
						node.destroy().then(() => {
							console.log('Closing "CLOSEABLE" element, resolving caller', node.caller);
							resolve(node.caller.deactivate());
						});
					}
				}, delay);
			} catch (e) {
				reject(e);
			}
		});
		/** Close (Hide and Destroy) this element
		    @param {number} delay Millisecond delay until element is closed
		    @returns {Promise<ThisType>} Promise Chain
		*/
		this.methods.close = (delay = 200) => node.hide(delay, false);
	}
	/** Overrides EL.open();
        Opens the CONTAINER up for editing.  This should create a link
        between the object on the server and its client side representation
        @returns {void}
    
	open() {
		try {
			this.status = STATUS.OPEN;
			super.open();
			this.el.setAttribute('data-status', 'open');
			this.header.btnLock.icon.el.className = ICONS.UNLOCK;
			this.header.options.el.removeAttribute('disabled');
		} catch (e) {
			console.log('Unable to open parent.', e);
		}
	}*/
	/** Closes the CONTAINER up for editing.  This should create a link
        between the object on the server and its client side representation
        and update accordingly
        @returns {void}
    
	close() {
		console.log('Locking ' + this.element + '(' + this.getId() + ')');
		this.status = STATUS.CLOSED;
		this.node.close();
		this.el.setAttribute('data-status', 'closed');
		// If section is open and we are trying to lock, we must first lock the children
        console.log(this.element + ' has ' + this.children.length + ' child(ren)');
        this.children.forEach((s) => {
            if (s.status === STATUS.OPEN) {
                s.close();
            }
        });
		console.log('Children are closed. Closing ' + this.element + '(' + this.getId() + ')');
		this.header.btnLock.icon.el.className = ICONS.LOCK;
		$(this.header.btnLock.el).removeClass('active');
		this.header.options.el.setAttribute('disabled', 'disabled');
		console.log('Locked');
	}*/
}
export { EL, Hideable, IFACE }