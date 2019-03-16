/** @module */
import IFACE, { EL } from './IFACE.js';
/** An interface for Move driven Events
    @class
    @extends IFACE
*/
export default class Movable extends IFACE {
	/** A series of Move Related Events and Methods
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
		node.el.addEventListener('up', () => node.up());
		node.el.addEventListener('down', () => node.down());
		//node.el.addEventListener('left', () => node.left());
		//node.el.addEventListener('right', () => node.right());
    }
    /** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		/** Moves the element up
	        @returns {Promise<ThisType>} Promise Chain
	    */
        this.methods.up = () => node.chain(() => console.log('Move Up', node));
		/** Moves the element down
		    @returns {Promise<ThisType>} Promise Chain
		*/
        this.methods.down = () => node.chain(() => console.log('Move Down', node));
	}
	/** Moves this element UP one slot
	    @returns {ThisType} This Container
	*/
	moveUp() {
		let node = $(this.el);
		if (node.prev().length > 0) {
			node.animate({
				height: 'toggle'
			}, 300);
			setTimeout(() => {
				node.prev().animate({
					height: 'toggle'
				}, 300).insertAfter(node).animate({
					height: 'toggle'
				}, 300);
			}, 0);
			setTimeout(() => {
				node.animate({
					height: 'toggle'
				}, 300).delay(300);
			}, 300);
		}
		return this;
	}
	/** Moves this element DOWN one slot
	    @returns {ThisType} This Container
	*/
	moveDown() {
		let node = $(this.el);
		if (node.next().length > 0) {
			node.animate({
				height: 'toggle'
			}, 300);
			setTimeout(() => {
				node.next().animate({
					height: 'toggle'
				}, 300).insertBefore(node).animate({
					height: 'toggle'
				}, 300).delay(300);
			}, 0);
			setTimeout(() => {
				node.animate({
					height: 'toggle'
				}, 300);
			}, 300);
		}
		return this;
	}
	/** Moves the Container up one slot in the DOM
	    @returns {void}
	*/
	up() {
		this.navheader.toggle();
		this.navfooter.toggle();
		this.moveUp();
	}
	/** Moves the Container down one slot in the DOM
	    @returns {void}
	*/
	down() {
		this.navheader.toggle();
		this.navfooter.toggle();
		this.moveDown();
	}
}
export { EL, IFACE }