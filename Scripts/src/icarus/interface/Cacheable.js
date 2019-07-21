/** @module */
import IFACE, { EL } from './IFACE.js';
import Move from '../event/Move.js';
/** An interface for Cache driven Events
    @description A Cacheable object has an unique identifier and discriminator
    @class
    @extends IFACE
*/
export default class Cacheable extends IFACE {
	/** A series of Cache Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
    constructor(node) {
        super(node, 'movable');
    }
    /** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
    addListeners(node) {
        node.el.addEventListener('cache', () => node.cache());
    }
    /** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
    setMethods(node) {
		/** Cache this element
		    @returns {Promise<ThisType>} Promise Chain
		*/
        this.methods.cache = () => node.chain(() => {
            try {
                console.log('TODO: Cache this element', node);
            } catch (e) {
                if (e instanceof TypeError) {
                    console.warn('Unable to cache', node, e);
                }
            }
        });
        /** Returns the objects unique identifier
	        @returns {UId} Unique Identifier
	    
        this.methods.getId = () => node.id;*/
        /** Sets this Container's unique identifier to the given id
            @param {number} id Container UId
            @returns {ThisType} Method Chain
        
        this.methods.setId = (id) => {
            if (typeof id !== 'undefined' && id !== null) {
                node.id = id;
                node.el.setAttribute('id', id);
            }
            return this;
        }*/
    }
}
export { EL, IFACE, Move }