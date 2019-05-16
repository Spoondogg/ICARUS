/** @module */
import IFACE, { EL } from './IFACE.js';
import Collapse from '../event/Collapse.js';
import Modify from '../event/Modify.js';
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
        node.dragging = false;
	}
	/** Adds listeners where applicable
	    @param {EL} node Element to append listeners
	    @returns {void}
	*/
	addListeners(node) {
		node.el.addEventListener('dragstart', (ev) => this.onError(node.dragstart, ev, 'DragStart Failed'));
		node.el.addEventListener('drop', (ev) => this.onError(node.drop, ev, 'Drop Failed'));
        node.el.addEventListener('dragover', (ev) => this.onError(node.dragover, ev, 'DragOver Failed'));
        node.el.addEventListener('dragleave', (ev) => this.onError(node.dragleave, ev, 'DragLeave Failed'));
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
            node.dragging = true;
            try {
                let cnt = node.getContainer();
                console.log(' - Setting ' + cnt.toString() + ' state to modified');
                cnt.el.dispatchEvent(new Modify(cnt));

                //console.log('Dragging: ' + node.toString() + '::' + node.label);
                node.addClass('dragging');
                node.body.el.dispatchEvent(new Collapse(node.body)); //node.body.collapse();
				ev.dataTransfer.setData("Container", node.id);
				ev.stopPropagation();
			} catch (e) {
				console.warn('Unable to dispatch DragStart', node, ev);
				throw e;
			}
		};
		// Drop this element
		this.methods.drop = (ev) => {
            let cont = ev.dataTransfer.getData("Container");
            //console.log('Dropping: ' + node.toString() + '::' + node.label + ' before Element(' + cont.toString() + ')');
            //https://stackoverflow.com/a/37297292/722785
            [...document.getElementsByClassName('drag-over')].forEach((el) => el.classList.remove('drag-over'));

            let container = $(document.getElementById(cont));
            container.insertBefore(node.el);

            let cnt = node.getContainer();
            //console.log(' - Setting ' + cnt.toString() + ' state to modified');
            cnt.el.dispatchEvent(new Modify(cnt));
			ev.preventDefault();
			ev.stopPropagation();
		};
		// Allow drop on this element
		this.methods.dragover = (ev) => {
            //console.log('Dragging over ' + node.toString() + '::' + node.label);
            node.addClass('drag-over');
			ev.preventDefault();
			ev.stopPropagation();
        };
        // No longer having an element dragged over this
        this.methods.dragleave = (ev) => {
            //console.log('Drag-Leave ' + node.toString() + '::' + node.label);
            node.removeClass('drag-over');
            ev.preventDefault();
            ev.stopPropagation();
        };
		// Action(s) performed when drag events complete
        this.methods.dragend = (ev) => {
            node.dragging = false;
            node.removeClass('dragging');
            //console.log('Drag End: ' + node.toString() + '::' + node.label);
			ev.stopPropagation();
		};
	}
}
export { Collapse, EL, Modify }