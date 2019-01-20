/** @module */
import IFACE, {
	EL
} from '../IFACE.js';
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
	addListeners(node) {
		node.el.addEventListener('dragstart', (ev) => node.dragstart(ev));
		node.el.addEventListener('drop', (ev) => node.drop(ev));
		node.el.addEventListener('dragover', (ev) => node.dragover(ev));
		node.el.addEventListener('dragend', (ev) => node.dragend(ev));
	}
	setMethods(node) {
		// Drag the element
		this.methods.dragstart = (ev) => {
			console.log('Dragging: ' + node.className + '(' + node.id + ') ' + node.label);
			//node.body.collapse();
			ev.dataTransfer.setData("Container", node.id);
		};
		// Drop the element
		this.methods.drop = (ev) => {
			console.log('Dropping: ' + node.className + '(' + node.id + ')');
			ev.preventDefault();
			//let container = $(document.getElementById(ev.dataTransfer.getData("Container")));
			//container.insertBefore(node.el);
			//container.collapse('show');
		};
		// Allow drop on this element
		this.methods.dragover = (ev) => {
			console.log('Dragging over ' + node.className + '(' + node.id + ')');
			ev.preventDefault();
		};
		this.methods.dragend = () => {
			console.log('Drag End ' + node.className + '(' + node.id + ')');
		};
	}
}
export {
	EL
};