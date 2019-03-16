/** @module */
import IFACE, { EL } from './IFACE.js';
/** An interface for Drag driven Events
    @see https://www.w3schools.com/jsref/event_ondrag.asp
    @class
    @extends IFACE
*/
export default class Draggable extends IFACE {
	/** A series of Drag Related Events and Methods
        @param {EL} node Class to implement this interface (Typically 'this')
	*/
	constructor(node) {
		super(node, 'draggable');
		node.setAttribute('draggable', true);
    }
    /** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
	addListeners(node) {
		node.el.addEventListener('dragstart', (ev) => this.onError(node.dragstart, ev, 'DragStart Failed'));
		node.el.addEventListener('drop', (ev) => this.onError(node.drop, ev, 'Drop Failed'));
		node.el.addEventListener('dragover', (ev) => this.onError(node.dragover, ev, 'DragOver Failed'));
		node.el.addEventListener('dragend', (ev) => this.onError(node.dragend, ev, 'DragEnd Failed'));
    }
    /** Appends Interface methods to class that implements them
	    @param {EL} node Element to implement methods
	    @returns {void}
	*/
	setMethods(node) {
		/** Drag Start Event Handler: Drag the element
            @param {Event} ev DragStart Event
            @returns {void}
        */
        this.methods.dragstart = (ev) => {
            try {
                console.log('Dragging: ' + node.className + '(' + node.id + ') ' + node.label);
                //node.body.collapse();
                ev.dataTransfer.setData("Container", node.id);
                ev.stopPropagation();
            } catch (e) {
                console.warn('Unable to dispatch DragStart for ' + this.className);
                throw e;
            }            
		};
		// Drop the element
		this.methods.drop = (ev) => {
			console.log('Dropping: ' + node.className + '(' + node.id + ')');
			//let container = $(document.getElementById(ev.dataTransfer.getData("Container")));
			//container.insertBefore(node.el);
			//container.collapse('show');
            ev.preventDefault();
            ev.stopPropagation();
		};
		// Allow drop on this element
		this.methods.dragover = (ev) => {
			console.log('Dragging over ' + node.className + '(' + node.id + ')');
            ev.preventDefault();
            ev.stopPropagation();
        };
        // Action(s) performed when drag events complete
		this.methods.dragend = (ev) => {
            console.log('Drag End ' + node.className + '(' + node.id + ')');
            ev.stopPropagation();
		};
	}
}
export { EL }